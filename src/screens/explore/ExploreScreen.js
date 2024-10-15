import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
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
import { getUserAbouts } from "../../services/User/get-user-abouts";
import { Image } from "expo-image";
import CustomText from "../../components/CustomText";
import { t } from "i18next";
import { postSwipe } from "../../services/Matching/send-swiper";
import Quiz from "../../components/Quiz";

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
  const [selectedAbouts, setSelectedAbouts] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [showMatches, setShowMatches] = useState(true);
  const [showQuiz, setShowQuiz] = useState(false);
  const [isSwipingEnabled, setIsSwipingEnabled] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [page, setPage] = useState(1);
  const swiperRef = useRef(null);

  useEffect(() => {
    const getMatches = async () => {
      const response = await getPotentialMatches(page);
      setMatches((prevData) => [...prevData, ...response.MatchUser.Contents]);
    };
    getMatches();
  }, [page]);

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
    const getAboutMe = async () => {
      const response = await getUserAbouts();
      const excludeTitles = [
        "Interest",
        "DreamVacation",
        "GuiltyPleasure",
        "CurrentObsession",
        "LastWatched",
      ];

      const interestData = response.userAbouts.find(
        (userAbout) => userAbout.title === "Interest"
      );

      const filteredDataForAbouts = response.userAbouts
        .filter((userAbout) => !excludeTitles.includes(userAbout.title))
        .flatMap((userAbout) => userAbout.values);

      setSelectedAbouts(filteredDataForAbouts);
      setSelectedInterests(interestData.values);
    };
    getAboutMe();
  }, []);

  const handleOnSwiped = (cardIndex) => {
    if (cardIndex === matches.length - 4) {
      setPage((prevPage) => prevPage + 1);
    } else if (cardIndex === matches.length - 1) {
      setShowMatches(false);
    }
  };
  const handleOnLeftSwipe = async (id) => {
    const data = {
      swipedUserId: id,
      isLike: false,
      superLikeUsed: false,
    };
    const response = await postSwipe(data);
    console.log("response", response);
  };

  const handleOnRightSwipe = async () => {
    setIsSwipingEnabled(true);
    setTimeout(() => {
      setIsSwipingEnabled(false);
    }, 1000);
    setShowQuiz(true);
    // const data = {
    //   swipedUserId: id,
    //   isLike: true,
    //   superLikeUsed: false,
    // };
    // const response = await postSwipe(data);
    // console.log("responseRight",response);
  };

  const handleRightPress = () => {
    if (isSwipingEnabled) return;

    swiperRef.current.swipeRight();

    setIsButtonDisabled(true);
    setTimeout(() => {
      setIsButtonDisabled(false);
    }, 1000);
  };

  return (
    <View
      style={{
        marginTop: insets.top,
        flex: 1,
        paddingHorizontal: 16,
      }}
    >
      <View style={styles.head}>
        <Pressable
          onPress={() => swiperRef.current.swipeBack()}
          style={!showMatches && { opacity: 0, pointerEvents: "none" }}
        >
          <Undo />
        </Pressable>
        <Corny />
        <Filter style={{ opacity: 0, pointerEvents: "none" }} />
      </View>
      {showMatches ? (
        <>
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
                selectedAbouts={selectedAbouts}
                selectedInterests={selectedInterests}
              />
            )}
            backgroundColor="none"
            cardVerticalMargin={40}
            showSecondCard={true}
            verticalSwipe={false}
            cardIndex={0}
            stackSize={3}
            onSwiped={handleOnSwiped}
            onSwipedLeft={handleOnLeftSwipe}
            onSwipedRight={handleOnRightSwipe}
            disableRightSwipe={isSwipingEnabled}
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
              onPress={handleRightPress}
              disabled={isButtonDisabled}
            >
              <Like style={{ color: "#FF524F" }} />
            </Pressable>
          </View>
        </>
      ) : (
        <View style={styles.emptyWrapper}>
          <Image
            source={require("../../assets/images/empy-corns.png")}
            style={styles.emptyImg}
          />
          <CustomText style={styles.emptyText}>
            {t("NOTHING_AROUND")}
          </CustomText>
        </View>
      )}
      {showQuiz && <Quiz quizOpen={showQuiz} setQuizOpen={setShowQuiz} />}
    </View>
  );
};

const { height, width } = Dimensions.get("window");

const styles = StyleSheet.create({
  head: {
    flexDirection: "row",
    justifyContent: "space-between",
    position: "relative",
    zIndex: 2,
  },
  actionWrapper: {
    position: "absolute",
    bottom: height > 860 ? 50 : 20,
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

  emptyWrapper: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  emptyImg: {
    width: 120,
    height: 120,
  },
  emptyText: {
    fontWeight: "500",
    fontSize: 16,
    lineHeight: 25,
    color: "#ACACAC",
  },
});

export default ExploreScreen;
