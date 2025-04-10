import React, { useEffect, useState } from "react";
import { Modal, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import CustomText from "../../components/CustomText";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Button from "../../components/Button";
import Edit from "../../assets/svg/edit.svg";
import { useNavigation } from "@react-navigation/native";
import { getAccountDetails } from "../../services/User/get-user-account-detail";
import useUserStore from "../../store/useUserStore";
import MenuItem from "./components/MenuItem";
import { t } from "i18next";
import { Image } from "expo-image";
import * as SecureStore from "expo-secure-store";
import * as Updates from "expo-updates";
import { getDeviceInfo } from "../../helper/getDeviceInfo";
import { postMarketingEvents } from "../../services/Event/send-marketing-event";

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
  // {
  //   id: "5",
  //   name: t("RESTORE_PURCHASE"),
  // },
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
  const [modalVisible, setModalVisible] = useState(false);

  const menuItemPressHandler = (screen) => {
    if (screen === "Logout") {
      setModalVisible(true);
    } else {
      navigation.navigate(`${screen}`);
    }
  };

  useEffect(() => {
    const getUserInfo = async () => {
      const response = await getAccountDetails();
      console.log("resp",response);
      

      userStore.setUserAccountDetails({
        profilePicture: response.account.profileImage?.imageUrl,
        name: response.account.name,
        age: response.account.age,
        email: response.account.email,
        phoneNumber: response.account.phoneNumber,
        userId: response.account.userId
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

  const logoutHandler = async () => {
    await SecureStore.deleteItemAsync("refresh_token");
    await Updates.reloadAsync();
  };

  const profilePicturePressHandler = () => {
    navigation.navigate("LikesDetail", {
      userId : userStore.userAccountDetails?.userId,
      tabIndex: 1,
      showRate: false
    });
  }

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
        </View>
        <View style={styles.menu}>
          {menuData.map((item) => (
            <MenuItem
              key={item.id}
              name={item.name}
              onPress={() => menuItemPressHandler(item.screen)}
            />
          ))}
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
});

export default ProfileScreen;
