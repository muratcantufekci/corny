import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import CustomText from "../../components/CustomText";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Notifications from "expo-notifications";
import { allowAllUserNotifications } from "../../services/User/allow-all-notifications";
import { postExpoPushToken } from "../../services/User/send-expo-push-token";
import Constants from "expo-constants";
import Undo from "../../assets/svg/undo.svg";
import Corny from "../../assets/svg/corny.svg";
import Filter from "../../assets/svg/filter.svg";
import ProfileCard from "../../components/ProfileCard";
import Swiper from "react-native-deck-swiper";
import { getPotentialMatches } from "../../services/Matching/get-potential-matches";
import Like from "../../assets/svg/likes-passive.svg";
import Cross from "../../assets/svg/cross.svg";

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
  const [matches, setMatches] = useState([]);
  const [page, setPage] = useState(1);
  const swiperRef = useRef(null);

  useEffect(() => {
    const getMatches = async () => {
      const response = await getPotentialMatches(page);
      setMatches(response.MatchUser.Contents);
    };
    getMatches();
  }, []);

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
        marginTop: insets.top,
        flex: 1,
        paddingHorizontal: 16,
      }}
    >
      <View style={styles.head}>
        <Pressable onPress={() => swiperRef.current.swipeBack()}>
          <Undo />
        </Pressable>
        <Corny />
        <View style={{width:24}}></View>
        {/* <Filter /> */}
      </View>
      <Swiper
        cards={matches}
        ref={swiperRef}
        renderCard={(card) => (
          <ProfileCard
            key={card?.ProfileInfo.userId}
            images={card?.ProfileInfo.images}
            name={card?.ProfileInfo.name}
            age={card?.ProfileInfo.age}
            distance={card?.ProfileInfo.distance}
            tvShows={card?.ProfileInfo.tvShows}
            id={card?.ProfileInfo.userId}
            insets={insets}
          />
        )}
        backgroundColor="none"
        cardVerticalMargin={40}
        // cardHorizontalMargin={16}
        showSecondCard={true}
        verticalSwipe={false}
        cardIndex={0}
        stackSize={3}
      />
      <View style={styles.actionWrapper}>
        <Pressable
          style={styles.actionBox}
          onPress={() => swiperRef.current.swipeLeft()}
        >
          <Cross style={{ color: "#FFAC24" }} />
        </Pressable>
        <Pressable
          style={styles.actionBox}
          onPress={() => swiperRef.current.swipeRight()}
        >
          <Like style={{ color: "#FF524F" }} />
        </Pressable>
      </View>
    </View>
  );
};

const { height, width } = Dimensions.get("window");

const styles = StyleSheet.create({
  head: {
    flexDirection: "row",
    justifyContent: "space-between",
    position: "relative",
    zIndex: 2
  },
  actionWrapper: {
    position: "absolute",
    bottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    width: width,
  },
  actionBox: {
    width: height / 13.3,
    height: height / 13.3,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000000",
  },
});

export default ExploreScreen;
