import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Switch, View } from "react-native";
import CustomText from "../../components/CustomText";
import { getUserNotificationPreferences } from "../../services/User/get-user-notification-preferences";
import { postUserNotificationPreferences } from "../../services/User/send-user-notification-preferences";
import { t } from "i18next";

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
  useEffect(() => {
    const getNotifications = async () => {
      const response = await getUserNotificationPreferences();
      if (response.isSuccess) {
        setUserNotifications(response.preferences);
      }
    };
    getNotifications();
  }, []);
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
