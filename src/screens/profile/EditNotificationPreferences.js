import React, { useEffect, useRef, useState } from "react";
import { Dimensions, Image, Linking, Platform, StyleSheet, Switch, View } from "react-native";
import CustomText from "../../components/CustomText";
import { getUserNotificationPreferences } from "../../services/User/get-user-notification-preferences";
import { postUserNotificationPreferences } from "../../services/User/send-user-notification-preferences";
import { t } from "i18next";
import * as Notifications from "expo-notifications";
import AlertSheet from "../../components/AlertSheet";

const menuItemData = [
  {
    id: "1",
    name: t("MATCHES"),
    type: "match",
  },
  {
    id: "2",
    name: t("MESSAGES"),
    type: "message",
  },
  {
    id: "3",
    name: t("LIKES"),
    type: "like",
  },
  {
    id: "4",
    name: t("OFFER_AND_PROMOTIONS"),
    type: "offer",
  },
];

const MenuItem = ({ name, notification }) => {
  const [isEnabled, setIsEnabled] = useState(notification?.isAllowed || false);

  useEffect(() => {
    if (notification) {
      setIsEnabled(notification.isAllowed);
    }
  }, [notification]);

  const toggleSwitch = async () => {
    setIsEnabled((previousState) => !previousState);
    const response = await postUserNotificationPreferences(notification.type, !isEnabled);
  };

  return (
    <View style={styles.menuItem}>
      <CustomText style={styles.menuItemText}>{name}</CustomText>
      <Switch
        onValueChange={toggleSwitch}
        value={isEnabled}
        trackColor={{ false: "#E4E4E7", true: "#FF524F" }}
        ios_backgroundColor="#E4E4E7"
      />
    </View>
  );
};

const EditNotificationPreferences = () => {
  const [userNotifications, setUserNotifications] = useState([]);
  const alertSheetRef = useRef(null);
  const [alertSheetProps, setAlertSheetProps] = useState(null);

  useEffect(() => {
    const getNotifications = async () => {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      if (existingStatus !== "granted") {
        setAlertSheetProps({
          img: require("../../assets/images/warning.png"),
          title: t("WARNING"),
          desc: t("PERMISSION_NOTIFICATION"),
          btnText: t("OPEN_SETTINGS"),
          btnPress: openSettings
        });
        alertSheetRef.current?.present();
      }
      const response = await getUserNotificationPreferences();
      if (response.isSuccess) {
        setUserNotifications(response.preferences);
      }
    };
    getNotifications();
  }, []);

  const openSettings = () => {
    if (Platform.OS === "ios") {
      Linking.openURL("app-settings:");
    } else {
      Linking.openSettings();
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.notificationWrapper}>
        <Image
          source={require("../../assets/images/noise.png")}
          style={styles.notificationNoise}
          resizeMode="cover"
        />
        <CustomText style={styles.notificationText}>
          {t("NOTIFICATION_TITLE")}
        </CustomText>
        <Image source={require("../../assets/images/notification.png")} />
      </View>
      <View style={styles.menuItems}>
        {menuItemData.map((item) => (
          <MenuItem
            key={item.id}
            name={item.name}
            notification={userNotifications?.find(
              (notification) => notification.type === item.type
            )}
          />
        ))}
      </View>
      {alertSheetProps && (
        <AlertSheet sheetRef={alertSheetRef} sheetProps={alertSheetProps} />
      )}
    </View>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16
  },
  notificationWrapper: {
    position: "relative",
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 12,
    backgroundColor: "#FFD899",
    overflow: "hidden",
    marginTop: 12,
  },
  notificationText: {
    width: "70%",
    fontWeight: "600",
    fontSize: 16,
    lineHeight: 20,
    color: "#000000",
  },
  notificationNoise: {
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    opacity: 0.1,
    zIndex: 1,
    width: width -32
  },
  menuItems: {
    marginTop: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#E4E4E7",
  },
  menuItemText: {
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 24,
    color: "#000000",
  },
});

export default EditNotificationPreferences;
