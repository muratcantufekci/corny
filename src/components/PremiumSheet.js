import React, { useCallback, useState } from "react";
import { StyleSheet, TouchableOpacity, View, Linking, Platform, Alert } from "react-native";
import CustomText from "./CustomText";
import Button from "./Button";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import Minus from "../assets/svg/minus-negative.svg";
import Check from "../assets/svg/check.svg";
import Cross from "../assets/svg/cross.svg";
import SubscriptionBoxes from "./SubscriptionBoxes";
import { t } from "i18next";
import usePremiumPackagesStore from "../store/usePremiumPackagesStore";
import Purchases from "react-native-purchases";
import { purchasePremium } from "../services/Premium/purchase-premium";

const PremiumSheet = ({ sheetRef }) => {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const premiumStore = usePremiumPackagesStore();
  const data = [
    { feature: "Premium filters", basic: true, premium: true },
    { feature: "See who likes you", basic: false, premium: true },
    { feature: "No ads", basic: false, premium: true },
    { feature: "Change location", basic: false, premium: true },
    { feature: "Blurry profile", basic: true, premium: false },
    { feature: "Rewind profile", basic: false, premium: true },
    { feature: "Unlimited swipes", basic: true, premium: true },
    { feature: "1 Boost/month", basic: false, premium: true },
    { feature: "Nearby", basic: false, premium: true },
    { feature: "Views", basic: true, premium: false },
  ];

  const mapSubscriptionDataToStaticFormat = (revenueCatSubscriptions) => {
    return revenueCatSubscriptions.map((subscription, index) => {
      // Subscription süresini packageType'dan belirle
      let duration = "";
      let durationText = "";

      switch (subscription.packageType) {
        case "MONTHLY":
          duration = "1";
          durationText = "Month";
          break;
        case "THREE_MONTH":
          duration = "3";
          durationText = "Months";
          break;
        case "SIX_MONTH":
          duration = "6";
          durationText = "Months";
          break;
        case "ANNUAL":
          duration = "12";
          durationText = "Months";
          break;
        default:
          // Eğer packageType'dan belirlenemezse title'dan çıkarmaya çalış
          const titleMatch = subscription.product.title.match(
            /(\d+)\s*(Aylık|Month)/i
          );
          duration = titleMatch ? titleMatch[1] : "1";
          durationText = duration === "1" ? "Month" : "Months";
      }

      // Label belirleme - hangi paket popüler veya indirimli
      let label = "";

      if (subscription.packageType === "THREE_MONTH") {
        label = "POPULAR";
      } else if (subscription.packageType === "SIX_MONTH") {
        // 6 aylık pakette indirim hesapla (aylık fiyata göre)
        const monthlyPrice =
          revenueCatSubscriptions.find((s) => s.packageType === "MONTHLY")
            ?.product?.price || 0;
        if (monthlyPrice > 0) {
          const discount = Math.round(
            (1 - subscription.product.pricePerMonth / monthlyPrice) * 100
          );
          if (discount > 0) {
            label = `-${discount}%`;
          }
        }
      }

      return {
        id: index + 1,
        duration: duration, // "1", "3", "6" gibi
        price: subscription.product.priceString, // "₺49,99" formatında
        pricePerMonth:
          subscription.product.pricePerMonthString ||
          `${subscription.product.priceString}/month`, // Aylık fiyat
        label: label, // "POPULAR", "-20%" vs
        // Orijinal Revenue Cat datasını da saklayalım satın alma için
        originalData: subscription,
      };
    });
  };

  const subscriptionData = mapSubscriptionDataToStaticFormat(
    premiumStore.premiumPackages
  );

  const getQuantity = (productId, packageData) => {
    // Yazı ile yazılmış sayıları sayıya çevirme
    // Örnek: "five_hint_pack" -> 5, "ten_coin_pack" -> 10

    const textToNumber = {
      one: 1,
      three: 3,
      six: 6,
    };

    // Product ID'yi küçük harflere çevir ve kelimeler halinde ayır
    const words = productId.toLowerCase().split(/[_\-\s]+/);

    // Sayı karşılığı olan kelimeleri bul
    for (const word of words) {
      if (textToNumber[word]) {
        return textToNumber[word];
      }
    }

    // Eğer yazı bulunamazsa, orijinal regex ile sayısal değer arama
    const match = productId.match(/(\d+)/);
    if (match) {
      return parseInt(match[1]);
    }

    // Varsayılan 1
    return 1;
  };

  // Satın alma işlemi
  const handlePurchase = async () => {
    if (!selectedPackage) {
      Alert.alert("Hata", "Lütfen bir paket seçin");
      return;
    }

    setIsLoading(true);

    try {
      const packageData = selectedPackage.originalData;
      const product = packageData.product;

      // Revenue Cat ile satın alma işlemi
      const purchaserInfo = await Purchases.purchasePackage(packageData);

      console.log("Purchase successful:", purchaserInfo);

      // Consumable ürünlerde entitlements kontrolü yapmıyoruz
      // Direkt satın alma başarısını kontrol ediyoruz
      if (purchaserInfo && purchaserInfo.customerInfo) {
        // Non-consumable transactions kontrol et
        const nonConsumableTransactions =
          purchaserInfo.customerInfo.nonSubscriptionTransactions;

        // Son satın alınan ürünü kontrol et
        const latestTransaction =
          nonConsumableTransactions && nonConsumableTransactions.length > 0
            ? nonConsumableTransactions[nonConsumableTransactions.length - 1]
            : null;

        if (
          latestTransaction &&
          latestTransaction.productId === packageData.product.identifier
        ) {
          Alert.alert(
            "Başarılı!",
            "Satın alma işleminiz başarıyla tamamlandı!",
            [
              {
                text: "Tamam",
                onPress: () => {
                  sheetRef.current?.dismiss();
                  // Başarılı satın alma sonrası işlemler
                  sheetProps.onPurchaseSuccess &&
                    sheetProps.onPurchaseSuccess(
                      purchaserInfo,
                      latestTransaction
                    );
                },
              },
            ]
          );
        } else {
          // Alternatif: Sadece purchaserInfo varsa başarılı kabul et
          Alert.alert(
            "Başarılı!",
            "Satın alma işleminiz başarıyla tamamlandı!",
            [
              {
                text: "Tamam",
                onPress: () => {
                  sheetRef.current?.dismiss();
                },
              },
            ]
          );
        }
        const data = {
          paymentChannel: Platform.OS === 'ios' ? 'AppleIap' : 'GoogleIap',
          currency: product.currencyCode || 'USD',
          durationInMonths: getQuantity(product.identifier, packageData),
          totalPrice: parseFloat(product.price),
          unitPrice: parseFloat(product.price) / getQuantity(product.identifier, packageData),
          purchaseSuccessful: true,
          errorMessage: null,
        };

        const premiumResponse = await purchasePremium(data)

        console.log("premiumData",data);
        console.log("premiumResponse",premiumResponse);
      }
    } catch (error) {
      console.log("Purchase Error:", error);

      // Hata durumları
      if (error.code === "PURCHASE_CANCELLED") {
        // Kullanıcı satın almayı iptal etti
        Alert.alert("İptal", "Satın alma işlemi iptal edildi");
      } else if (error.code === "PRODUCT_NOT_AVAILABLE") {
        Alert.alert("Hata", "Bu ürün şu anda mevcut değil");
      } else if (error.code === "PAYMENT_PENDING") {
        Alert.alert("Beklemede", "Ödemeniz işlem görüyor, lütfen bekleyin");
      } else if (error.code === "STORE_PROBLEM") {
        Alert.alert("Mağaza Hatası", "App Store ile bağlantı sorunu yaşanıyor");
      } else if (error.code === "NETWORK_ERROR") {
        Alert.alert("Bağlantı Hatası", "İnternet bağlantınızı kontrol edin");
      } else {
        Alert.alert("Hata", "Satın alma işlemi sırasında bir hata oluştu");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLinkPress = async (url) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    }
  };

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        {...props}
      />
    ),
    []
  );

  return (
    <BottomSheetModal
      ref={sheetRef}
      snapPoints={["93%"]}
      index={0}
      enablePanDownToClose={true}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: "#FF524F" }}
    >
      <BottomSheetScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
      >
        <View style={styles.wrapper}>
          <TouchableOpacity
            style={styles.close}
            onPress={() => sheetRef.current?.dismiss()}
          >
            <Cross style={styles.cross} width={18} />
          </TouchableOpacity>
        </View>
        <CustomText style={styles.title}>{t("PREMIUM")}</CustomText>
        <CustomText style={styles.desc}>{t("PREMIUM_DESC")}</CustomText>
        <View style={styles.featuresContainer}>
          <View style={styles.headerRow}>
            <CustomText style={[styles.cell, styles.featureCell]}></CustomText>
            <View style={[styles.headerItem, styles.cell]}>
              <CustomText style={styles.header}>
                {t("BASIC").toUpperCase()}
              </CustomText>
            </View>
            <View style={[styles.headerItem, styles.cell]}>
              <CustomText style={styles.header}>
                {t("PREMIUM").toUpperCase()}
              </CustomText>
            </View>
          </View>

          {data.map((row, index) => (
            <View key={index} style={styles.row}>
              <View style={styles.featureCell}>
                <CustomText style={[styles.featureCellText]}>
                  {row.feature}
                </CustomText>
              </View>
              <View style={styles.cell}>
                {row.basic ? (
                  <Check width={22} style={styles.check} />
                ) : (
                  <Minus width={34} height={34} />
                )}
              </View>
              <View style={styles.cell}>
                {row.premium ? (
                  <Check width={22} style={styles.check} />
                ) : (
                  <Minus width={34} height={34} />
                )}
              </View>
            </View>
          ))}
        </View>
        <SubscriptionBoxes
          subscriptionData={subscriptionData}
          colors={{
            boxBorderColor: "#FFFFFF",
            selectedBoxColor: "#000",
            unselectedBoxColor: "#F5F5F5",
            selectedTextColor: "#FFFFFF",
            selectedPerMonthTextColor: "#FF524F",
          }}
          text={t("MONTH")}
          onPackageSelect={setSelectedPackage}
        />
        <View style={styles.info}>
          <CustomText style={styles.infoText}>
            {t("PREMIUM_INFO_T1")}
          </CustomText>
          <CustomText style={styles.infoText}>
            {t("PREMIUM_INFO_T2")}
          </CustomText>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <TouchableOpacity
              onPress={() =>
                handleLinkPress("https://cornyapp.com/gizlilik-politikasi/")
              }
            >
              <CustomText style={[styles.infoText, styles.policy]}>
                {t("PRIVACY_POLICY")}
              </CustomText>
            </TouchableOpacity>
            <CustomText style={styles.infoText}> {t("AND")} </CustomText>
            <TouchableOpacity
              onPress={() =>
                handleLinkPress("https://cornyapp.com/kullanim-kosullari/")
              }
            >
              <CustomText style={[styles.infoText, styles.policy]}>
                {t("TERM_AND_CONDITIONS")}
              </CustomText>
            </TouchableOpacity>
          </View>
          <CustomText style={styles.infoText}>
            {t("PREMIUM_INFO_T3")}
          </CustomText>
        </View>
        <Button variant="primary" style={styles.btn} onPress={handlePurchase}>
          {t("CONTİNUE")}
        </Button>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    alignItems: "center",
    backgroundColor: "#FF524F",
    paddingBottom: 32,
  },
  title: {
    fontWeight: "500",
    fontSize: 36,
    lineHeight: 40,
    color: "#000000",
    textAlign: "center",
    marginBottom: 8,
  },
  desc: {
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 24,
    color: "#000000",
    textAlign: "center",
  },
  btn: {
    marginTop: 30,
  },
  wrapper: {
    width: "100%",
    alignItems: "flex-end",
  },
  close: {
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#EFEFF1",
  },
  cross: {
    color: "#51525C",
  },
  featuresContainer: {
    width: "100%",
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#FFF5F5",
    marginVertical: 32,
  },
  headerRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    gap: 16,
    marginTop: 6,
  },
  cell: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  featureCell: {
    flex: 2,
    justifyContent: "center",
  },
  featureCellText: {
    fontWeight: "600",
    fontSize: 14,
    lineHeight: 24,
    color: "#51525C",
  },
  headerItem: {
    padding: 4,
    borderRadius: 4,
    backgroundColor: "#FF524F",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    fontWeight: "500",
    fontSize: 14,
    lineHeight: 16,
    color: "black",
  },
  check: {
    color: "#481211",
  },
  info: {
    marginTop: 32,
  },
  infoText: {
    fontWeight: "400",
    fontSize: 12,
    lineHeight: 16,
    textAlign: "center",
    color: "#FFFFFF",
  },
  policy: {
    color: "#FFFFFF",
    textDecorationLine: "underline",
  },
});

export default PremiumSheet;
