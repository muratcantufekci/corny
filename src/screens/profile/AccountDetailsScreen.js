import React, { useState } from "react";
import CustomText from "../../components/CustomText";
import MenuItem from "./components/MenuItem";
import { t } from "i18next";
import { Modal, StyleSheet, View } from "react-native";
import useUserStore from "../../store/useUserStore";
import Button from "../../components/Button";
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import * as Updates from "expo-updates";

const menuData = [
  {
    id: "1",
    name: t("NAME"),
    screen: "EditName",
    storeKey: "name",
  },
  {
    id: "2",
    name: t("MAIL"),
    screen: "EditMail",
    storeKey: "email",
  },
  {
    id: "3",
    name: t("PHONE_NUMBER"),
    screen: "EditPhone",
    storeKey: "phoneNumber",
  },
];

const AccountDetailsScreen = () => {
  const userStore = useUserStore();
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  const menuItemPressHandler = (screen) => {
    navigation.navigate(`${screen}`);
  };

  const deleteAccount = async () => {
    await SecureStore.deleteItemAsync("refresh_token");
    await SecureStore.deleteItemAsync("notification_token");
    await Updates.reloadAsync();
  };

  return (
    <>
      <View style={styles.menu}>
        {menuData.map((item) => (
          <MenuItem
            key={item.id}
            name={`${item.name}: ${
              userStore.userAccountDetails[item.storeKey]
            }`}
            onPress={() => menuItemPressHandler(item.screen)}
          />
        ))}
        <View style={styles.deleteContainer}>
          <CustomText style={styles.deleteText}>
            {t("DELETE_ACC_TEXT")}
          </CustomText>
          <Button variant="ghost" onPress={() => setModalVisible(true)}>
            {t("DELETE_ACCOUNT")}
          </Button>
        </View>
      </View>
      <Modal transparent={true} animationType="slide" visible={modalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modal}>
            <CustomText style={styles.modalTitle}>
              {t("DELETE_MODAL_TITLE")}
            </CustomText>
            <CustomText style={styles.modalDesc}>
              {t("DELETE_MODAL_DESC")}
            </CustomText>
            <View style={styles.btns}>
              <Button variant="danger" onPress={deleteAccount}>
                {t("DELETE_PERMANENTLY")}
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
  menu: {
    marginTop: 24,
    flex: 1,
    paddingHorizontal: 16,
  },
  deleteContainer: {
    marginTop: 70,
    gap: 36,
  },
  deleteText: {
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 24,
    color: "#51525C",
    textAlign: "center",
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

export default AccountDetailsScreen;
