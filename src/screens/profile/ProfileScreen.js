import React, { useEffect, useState } from "react";
import { Modal, ScrollView, StyleSheet, View } from "react-native";
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
    name: t("HELP"),
  },
  {
    id: "6",
    name: t("RESTORE_PURCHASE"),
  },
  {
    id: "7",
    name: t("TERM_AND_CONDITIONS"),
  },
  {
    id: "8",
    name: t("PRIVACY_POLICY"),
  },
  {
    id: "9",
    name: t("COOKIE_POLICY"),
  },
  {
    id: "10",
    name: t("LOGOUT"),
    screen: "Logout",
  },
];

const ProfileScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const userStore = useUserStore();
  const [modalVisible, setModalVisible] = useState(false);

  const menuItemPressHandler =  (screen) => {
    if (screen === "Logout") {
      setModalVisible(true)
    } else {
      navigation.navigate(`${screen}`);
    }
  };

  useEffect(() => {
    const getUserInfo = async () => {
      const response = await getAccountDetails();

      userStore.setUserAccountDetails({
        profilePicture: response.account.profileImage.imageUrl,
        name: response.account.name,
        age: response.account.age,
        email: response.account.email,
        phoneNumber: response.account.phoneNumber,
      });
    };
    getUserInfo();
  }, []);

  const logoutHandler = async () => {
    await SecureStore.deleteItemAsync("refresh_token");
    await Updates.reloadAsync();
  };

  return (
    <>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 55,
          paddingHorizontal: 16,
        }}
        style={{
          paddingTop: insets.top,
          flex: 1,
        }}
      >
        <View>
          <View style={styles.profileHead}>
            <Image
              source={{ uri: userStore.userAccountDetails?.profilePicture }}
              style={styles.profil}
            />
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
