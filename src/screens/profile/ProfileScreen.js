import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import CustomText from "../../components/CustomText";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Button from "../../components/Button";
import Edit from "../../assets/svg/edit.svg";
import { useNavigation } from "@react-navigation/native";
import { getAccountDetails } from "../../services/User/get-user-account-detail";
import useUserStore from "../../store/useUserStore";
import MenuItem from "../../components/MenuItem";
import { t } from "i18next";
import { Image } from "expo-image";
import * as SecureStore from "expo-secure-store";
import * as Updates from "expo-updates";
import { getDeviceInfo } from "../../helper/getDeviceInfo";
import { postMarketingEvents } from "../../services/Event/send-marketing-event";
import UtilitySheet from "../../components/UtilitySheet";
import PremiumSheet from "../../components/PremiumSheet";
import usePremiumPackagesStore from "../../store/usePremiumPackagesStore";
import { mapRevenueCatDataToStaticFormat } from "../../helper/rcDataToStatic";
import Purchases from "react-native-purchases";
import { purchasePremium } from "../../services/Premium/purchase-premium";

const { width } = Dimensions.get("window");

const menuData = [
  {
    id: "1",
    name: t("ACCOUNT_DETAILS"),
    screen: "AccountDetails",
  },
  {
    id: "2",
    name: t("NOTIFICATION_PREFERENCES"),
    screen: "NotificationPreferences",
  },
  {
    id: "3",
    name: t("LANGUAGE_PREFERENCES"),
    screen: "LanguagePreferences",
  },
  {
    id: "4",
    name: t("CONTACT_US"),
    screen: "ContactUs",
  },
  {
    id: "5",
    name: t("RESTORE_PURCHASE"),
    screen: "RestorePurchase",
  },
  {
    id: "6",
    name: t("TERM_AND_CONDITIONS"),
    screen: "TermsAndConditions",
  },
  {
    id: "7",
    name: t("PRIVACY_POLICY"),
    screen: "PrivacyPolicy",
  },
  {
    id: "8",
    name: t("LOGOUT"),
    screen: "Logout",
  },
];

const ProfileScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const userStore = useUserStore();
  const premiumStore = usePremiumPackagesStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [sheetProps, setSheetProps] = useState(null);
  const [shouldOpenSheet, setShouldOpenSheet] = useState(false);
  const sheetRef = useRef(null);
  const premiumSheetRef = useRef(null);
  const jokerSubscriptionData = mapRevenueCatDataToStaticFormat(
    premiumStore.jokerPackages,
    "joker"
  );
  const superlikeSubscriptionData = mapRevenueCatDataToStaticFormat(
    premiumStore.superlikePackages,
    "superlike"
  );

  const menuItemPressHandler = (screen) => {
    if (screen === "Logout") {
      setModalVisible(true);
    } else if (screen === "RestorePurchase") {
      restorePurchases();
    } else {
      navigation.navigate(`${screen}`);
    }
  };

  useEffect(() => {
    const getUserInfo = async () => {
      const response = await getAccountDetails();

      userStore.setUserAccountDetails({
        profilePicture: response.account.profileImage?.imageUrl,
        name: response.account.name,
        age: response.account.age,
        email: response.account.email,
        phoneNumber: response.account.phoneNumber,
        userId: response.account.userId,
      });
    };

    const postViewContent = async () => {
      const deviceInfo = await getDeviceInfo();
      const viewContentData = {
        deviceInfo,
        eventType: "ViewContent",
        eventData: ["profile"],
        fbc: "",
      };
      const viewContentRespone = await postMarketingEvents(viewContentData);
    };

    getUserInfo();
    postViewContent();
  }, []);

  useEffect(() => {
    if (shouldOpenSheet && sheetProps) {
      sheetRef.current?.present();
      setShouldOpenSheet(false);
    }
  }, [sheetProps, shouldOpenSheet]);

  const logoutHandler = async () => {
    await SecureStore.deleteItemAsync("refresh_token");
    await Updates.reloadAsync();
  };

  const profilePicturePressHandler = () => {
    navigation.navigate("LikesDetail", {
      userId: userStore.userAccountDetails?.userId,
      tabIndex: 1,
      showRate: false,
    });
  };

  const utilsPressHandler = (from) => {
    if (from === "joker") {
      setSheetProps({
        img: require("../../assets/images/boost.png"),
        title: "Joker",
        desc: t("JOKER_SHEET_DESC"),
        backgroundColor: "#FFE6E5",
        subscriptionData: jokerSubscriptionData,
        boxBorderColor: "#FF0A00",
        selectedBoxColor: "#FFB5B2",
        unselectedBoxColor: "#FFFFFF",
        text: "JOKER",
      });
    } else {
      setSheetProps({
        img: require("../../assets/images/superlike.png"),
        title: "Superlike",
        desc: t("SUPERLIKE_SHEET_DESC"),
        backgroundColor: "#FFF0D7",
        subscriptionData: superlikeSubscriptionData,
        boxBorderColor: "#FF9F00",
        selectedBoxColor: "#FFCF80",
        unselectedBoxColor: "#FFFFFF",
        text: "SUPERLIKE",
      });
    }

    setShouldOpenSheet(true);
  };

  const getQuantity = (productId) => {
    const textToNumber = {
      one: 1,
      three: 3,
      six: 6,
    };

    const words = productId.toLowerCase().split(/[_\-\s]+/);

    for (const word of words) {
      if (textToNumber[word]) {
        return textToNumber[word];
      }
    }

    const match = productId.match(/(\d+)/);
    if (match) {
      return parseInt(match[1]);
    }

    return 1;
  };

  const restorePurchases = async () => {
    try {
      const restore = await Purchases.restorePurchases();

      const activeSubscriptions = restore.activeSubscriptions;

      if (activeSubscriptions.length > 0) {
        // İlk aktif subscription'ı al
        const activeSubscription = activeSubscriptions[0];

        // Subscription detaylarını al
        const subscriptionDetails =
          restore.subscriptionsByProductIdentifier[activeSubscription];
        // Premium durumunu güncelle
        // updateUserPremiumStatus(activeSubscription, subscriptionDetails);

        const data = {
          paymentChannel: "AppleIap",
          currency: subscriptionDetails.price.currency || "USD",
          durationInMonths: getQuantity(subscriptionDetails.productIdentifier),
          totalPrice: parseFloat(subscriptionDetails.price.amount),
          unitPrice: parseFloat(subscriptionDetails.price.amount),
          purchaseSuccessful: true,
          errorMessage: null,
        };

        const premiumResponse = await purchasePremium(data);
        if (premiumResponse.isSuccess) {
          userStore.setIsUserPremium(true);
        }
        Alert.alert("Successful!", `Your subscription has been restored!`);
      } else {
        Alert.alert("Information", "No subscription found to load data.");
      }
    } catch (error) {
      console.error("Restore error:", error);
      Alert.alert("Error", "An error occurred while restoring purchases.");
    }
  };

  return (
    <>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 71,
          paddingHorizontal: 16,
        }}
        style={{
          paddingTop: insets.top + 16,
          flex: 1,
        }}
      >
        <View>
          <View style={styles.profileHead}>
            <TouchableOpacity onPress={profilePicturePressHandler}>
              <Image
                source={{ uri: userStore.userAccountDetails?.profilePicture }}
                style={styles.profil}
              />
            </TouchableOpacity>
            <CustomText style={styles.name}>
              {userStore.userAccountDetails &&
                `${userStore.userAccountDetails.name}, ${userStore.userAccountDetails.age}`}
            </CustomText>
            <Button
              variant="primary"
              prevIcon={<Edit />}
              style={{ width: "50%", paddingVertical: 8 }}
              onPress={() => navigation.navigate("EditProfile")}
            >
              {t("EDIT_PROFILE")}
            </Button>
          </View>
          <View style={styles.subscription}>
            <Pressable
              style={styles.subscriptionItem}
              onPress={() => utilsPressHandler("joker")}
            >
              <Image
                source={require("../../assets/images/boost.png")}
                style={styles.subscriptionItemImg}
              />
              <View style={styles.subscriptionItemText}>
                <CustomText style={styles.subscriptionItemTitle}>
                  Joker
                </CustomText>
                <CustomText style={styles.subscriptionItemCount}>
                  {userStore.jokerCount}
                </CustomText>
              </View>
            </Pressable>
            <Pressable
              style={[
                styles.subscriptionItem,
                styles.subscriptionItemPackage,
                userStore.isUserPremium
                  ? styles.subscriptionItemPackagePremium
                  : styles.subscriptionItemPackageBasic,
              ]}
              onPress={() =>
                !userStore.isUserPremium && premiumSheetRef.current?.present()
              }
            >
              <Image
                source={require("../../assets/images/noise.png")}
                style={styles.boxNoise}
                contentFit="cover"
              />
              <CustomText style={styles.subscriptionItemTitle}>
                {t("SUBSCRIPTION")}
              </CustomText>
              <CustomText style={styles.subscriptionItemCount}>
                {userStore.isUserPremium ? t("PREMIUM") : t("BASIC")}
              </CustomText>
            </Pressable>
            <Pressable
              style={styles.subscriptionItem}
              onPress={() => utilsPressHandler("superlike")}
            >
              <Image
                source={require("../../assets/images/superlike.png")}
                style={styles.subscriptionItemImg}
              />
              <View style={styles.subscriptionItemText}>
                <CustomText style={styles.subscriptionItemTitle}>
                  Superlike
                </CustomText>
                <CustomText style={styles.subscriptionItemCount}>
                  {userStore.superlikeCount}
                </CustomText>
              </View>
            </Pressable>
          </View>
        </View>
        <View style={styles.menu}>
          {menuData.map((item) => {
            if (
              Platform.OS === "android" &&
              item.screen === "RestorePurchase"
            ) {
              return null;
            }

            return (
              <MenuItem
                key={item.id}
                name={item.name}
                onPress={() => menuItemPressHandler(item.screen)}
              />
            );
          })}
        </View>
      </ScrollView>
      <Modal transparent={true} animationType="slide" visible={modalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modal}>
            <CustomText style={styles.modalTitle}>
              {t("LOGOUT_MODAL_TITLE")}
            </CustomText>
            <CustomText style={styles.modalDesc}>
              {t("LOGOUT_MODAL_DESC")}
            </CustomText>
            <View style={styles.btns}>
              <Button variant="danger" onPress={logoutHandler}>
                {t("LOGOUT")}
              </Button>
              <Button variant="ghost" onPress={() => setModalVisible(false)}>
                {t("CANCEL")}
              </Button>
            </View>
          </View>
        </View>
      </Modal>
      {sheetProps && (
        <UtilitySheet sheetProps={sheetProps} sheetRef={sheetRef} />
      )}
      <PremiumSheet sheetRef={premiumSheetRef} />
    </>
  );
};

const styles = StyleSheet.create({
  profileHead: {
    alignItems: "center",
    gap: 16,
    marginTop: 12,
  },
  profil: {
    width: 100,
    height: 100,
    borderRadius: 999,
  },
  name: {
    fontWeight: "600",
    fontSize: 18,
    lineHeight: 24,
    color: "#000000",
  },
  menu: {
    marginTop: 32,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: 22,
  },
  modal: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 24,
    borderRadius: 10,
  },
  modalTitle: {
    fontWeight: "600",
    fontSize: 18,
    lineHeight: 24,
    color: "#000000",
    textAlign: "center",
    marginBottom: 8,
  },
  modalDesc: {
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 24,
    color: "#51525C",
    textAlign: "center",
  },
  btns: {
    marginTop: 32,
    gap: 8,
  },
  subscription: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    marginTop: 24,
  },
  subscriptionItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    overflow: "hidden",
  },
  subscriptionItemPackage: {
    height: 120,
    borderRadius: 12,
  },
  subscriptionItemPackageBasic: {
    borderWidth: 1,
    borderBlockColor: "#000000",
    backgroundColor: "#E4E4E7",
  },
  subscriptionItemPackagePremium: {
    backgroundColor: "#FFAC24",
  },
  subscriptionItemImg: {
    width: 72,
    height: 72,
  },
  subscriptionItemText: {
    alignItems: "center",
    justifyContent: "center",
  },
  subscriptionItemTitle: {
    fontWeight: "400",
    fontSize: 14,
    lineHeight: 20,
    color: "#000000",
  },
  subscriptionItemCount: {
    fontWeight: "500",
    fontSize: 20,
    lineHeight: 24,
    color: "#000000",
  },
  boxNoise: {
    position: "absolute",
    top: 0,
    left: 0,
    opacity: 0.3,
    zIndex: 1,
    width: (width - 52) / 3,
    height: 120,
  },
});

export default ProfileScreen;
