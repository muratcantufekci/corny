import React, { useEffect, useState } from "react";
import { Platform, View } from "react-native";
import CustomText from "../../components/CustomText";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Notifications from "expo-notifications";
import { allowAllUserNotifications } from "../../services/User/allow-all-notifications";
import { postExpoPushToken } from "../../services/User/send-expo-push-token";
import Constants from "expo-constants";

const registerForPushNotificationsAsync = async () => {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();

    if (status !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }

    const response = await allowAllUserNotifications();
    
    if (!response.isSuccess) {
      console.error("Failed to allow notifications.");
    }
  }

  token = (
    await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig.extra.eas.projectId,
    })
  ).data;

  const resp = await postExpoPushToken({
    expoPushToken: token,
    deviceId: "",
  });

  return token;
};

const ExploreScreen = () => {
  const insets = useSafeAreaInsets();
  const [expoPushToken, setExpoPushToken] = useState("");

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      setExpoPushToken(token);
    });
    // const notificationListener = Notifications.addNotificationReceivedListener(notification => {
    //   console.log('Notification received:', notification);
    // });

    // const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
    //   console.log('Notification response:', response);
    // });
    // console.log("notificationListener",notificationListener);
    // console.log("responseListener",responseListener);
  }, []);
  return (
    <View
      style={{
        paddingTop: insets.top,
      }}
    >
      <CustomText>Explore Screen {expoPushToken}</CustomText>
    </View>
  );
};

export default ExploreScreen;
