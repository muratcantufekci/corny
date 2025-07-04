import React, { useCallback, useState } from "react";
import { Alert, Image, Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import CustomText from "./CustomText";
import Button from "./Button";
import { BottomSheetBackdrop, BottomSheetModal } from "@gorhom/bottom-sheet";
import { t } from "i18next";
import Cross from "../assets/svg/cross.svg";
import SubscriptionBoxes from "./SubscriptionBoxes";
import Purchases from "react-native-purchases";
import { purchaseConsumable } from "../services/Consumable/purchase-consumable";
import useUserStore from "../store/useUserStore";

const UtilitySheet = ({ sheetProps, sheetRef }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const userStore = useUserStore();

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

  const getQuantity = (productId, packageData) => {
    // Yazı ile yazılmış sayıları sayıya çevirme
    // Örnek: "five_hint_pack" -> 5, "ten_coin_pack" -> 10
    
    const textToNumber = {
      'five': 5,
      'ten': 10,
      'fifteen': 15,
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
      Alert.alert("Error", "Please choose a package");
      return;
    }
  
    setIsLoading(true);
  
    try {
      const packageData = selectedPackage.originalData;
      const product = packageData.product;
      
      // Revenue Cat ile satın alma işlemi
      const purchaserInfo = await Purchases.purchasePackage(packageData);
      
      // Consumable ürünlerde entitlements kontrolü yapmıyoruz
      // Direkt satın alma başarısını kontrol ediyoruz
      if (purchaserInfo && purchaserInfo.customerInfo) {
        // Non-consumable transactions kontrol et
        const nonConsumableTransactions = purchaserInfo.customerInfo.nonSubscriptionTransactions;
        
        // Son satın alınan ürünü kontrol et
        const latestTransaction = nonConsumableTransactions && nonConsumableTransactions.length > 0 
          ? nonConsumableTransactions[nonConsumableTransactions.length - 1] 
          : null;
        
        if (latestTransaction && latestTransaction.productId === packageData.product.identifier) {
          Alert.alert(
            "Successful!",
            "Your purchase has been completed successfully!",
            [
              {
                text: "Okey",
                onPress: () => {
                  sheetRef.current?.dismiss();
                  // Başarılı satın alma sonrası işlemler
                  sheetProps.onPurchaseSuccess &&
                    sheetProps.onPurchaseSuccess(purchaserInfo, latestTransaction);
                },
              },
            ]
          );
        } else {
          // Alternatif: Sadece purchaserInfo varsa başarılı kabul et
          Alert.alert(
            "Successful!",
            "Your purchase has been completed successfully!",
            [
              {
                text: "Okey",
                onPress: () => {
                  sheetRef.current?.dismiss();
                  // Consumable ürün satın alındı
                  sheetProps.onPurchaseSuccess &&
                    sheetProps.onPurchaseSuccess(purchaserInfo);
                },
              },
            ]
          );
        }
        const data = {
          consumableType: sheetProps.title === "Joker" ? "Hint" : "SuperLike",
          paymentChannel: Platform.OS === 'ios' ? 'AppleIap' : 'GoogleIap',
          currency: product.currencyCode || 'USD',
          quantity: getQuantity(product.identifier, packageData),
          totalPrice: parseFloat(product.price),
          unitPrice: parseFloat(product.price) / getQuantity(product.identifier, packageData),
          purchaseSuccessful: true,
          errorMessage: null,
        };

        const consumableResponse = await purchaseConsumable(data)
        
        if( consumableResponse.isSuccess) {
          if(sheetProps.title === "Joker") {
            userStore.setJokerCount(current => current + data.quantity)
          } else {
            userStore.setSuperlikeCount(current => current + data.quantity)
          }
        }
      }
    } catch (error) {
      console.log("Purchase Error:", error);
      
      // Hata durumları
      if (error.code === "PURCHASE_CANCELLED") {
        // Kullanıcı satın almayı iptal etti
        Alert.alert("Cancel", "Purchase cancelled");
      } else if (error.code === "PRODUCT_NOT_AVAILABLE") {
        Alert.alert("Error", "This product is currently unavailable");
      } else if (error.code === "PAYMENT_PENDING") {
        Alert.alert("Pending", "Your payment is being processed, please wait");
      } else if (error.code === "STORE_PROBLEM") {
        Alert.alert("Store Error", "There is a connection problem");
      } else if (error.code === "NETWORK_ERROR") {
        Alert.alert("Connection Error", "Check your internet connection");
      } else {
        Alert.alert("Error", "An error occurred during the purchase process");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BottomSheetModal
      ref={sheetRef}
      snapPoints={["93%"]}
      index={0}
      enablePanDownToClose={true}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: sheetProps.backgroundColor }}
    >
      <View style={styles.container}>
        <View style={styles.wrapper}>
          <TouchableOpacity
            style={styles.close}
            onPress={() => sheetRef.current?.dismiss()}
          >
            <Cross style={styles.cross} width={18} />
          </TouchableOpacity>
        </View>
        <Image source={sheetProps.img} style={styles.img} />
        <CustomText style={styles.title}>{sheetProps.title}</CustomText>
        <CustomText style={styles.desc}>{sheetProps.desc}</CustomText>
        <SubscriptionBoxes
          subscriptionData={sheetProps.subscriptionData}
          colors={{
            boxBorderColor: sheetProps.boxBorderColor,
            selectedBoxColor: sheetProps.selectedBoxColor,
            unselectedBoxColor: sheetProps.unselectedBoxColor,
            selectedTextColor: "#000",
            selectedPerMonthTextColor: "#000",
          }}
          text={sheetProps.text}
          onPackageSelect={setSelectedPackage}
        />
        <Button
          variant="primary"
          onPress={handlePurchase}
          style={styles.btn}
          // disabled={isLoading || !selectedPackage}
        >
          {t("CONTİNUE")}
        </Button>
      </View>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 32,
    alignItems: "center",
  },
  img: {
    width: 160,
    height: 160,
    marginBottom: 16,
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
    color: "#51525C",
    textAlign: "center",
    marginBottom: 32,
  },
  btn: {
    marginTop: 80,
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
    backgroundColor: "#FFFFFF",
  },
  cross: {
    color: "#51525C",
  },
});

export default UtilitySheet;
