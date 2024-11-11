import React, { useCallback, useEffect, useRef, useState } from "react";
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
import { BottomSheetBackdrop, BottomSheetModal } from "@gorhom/bottom-sheet";
import Input from "../../components/Input";
import { TouchableOpacity } from "react-native";
import ArrowUp from "../../assets/svg/arrow-up-circle.svg";
import useUserStore from "../../store/useUserStore";
import MatchingSheet from "../../components/MatchingSheet";

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
  const [showMatches, setShowMatches] = useState(true);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizData, setQuizData] = useState(null);
  const [quizAnswer, setQuizAnswer] = useState(null);
  const [isSwipingEnabled, setIsSwipingEnabled] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [page, setPage] = useState(1);
  const [cardIndex, setCardIndex] = useState(0);
  const swiperRef = useRef(null);
  const sheetRef = useRef(null);
  const [sheetProps, setSheetProps] = useState(null);
  const userStore = useUserStore();

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

      userStore.setcardAbouts(filteredDataForAbouts);
      userStore.setcardInterests(interestData.values);
    };
    getAboutMe();
  }, []);

  useEffect(() => {
    const handlePostSwipe = async () => {
      const data = {
        swipedUserId: matches[cardIndex].ProfileInfo.userId,
        isLike: true,
        superLikeUsed: false,
      };

      try {
        const response = await postSwipe(data);

        if (response.isMatch) {
          sheetRef.current?.present();
          setSheetProps({
            title: t("MATCH_TITLE"),
            desc: t("MATCH_DESC"),
            myImg: response.myUser.profileImage.imageUrl,
            otherUserImg: response.swipedUser.profileImage.imageUrl,
            swipedUserId: response.swipedUser.userId,
          });
        } else {
          sheetRef.current?.present();
          setSheetProps({
            title: t("LIKE_TITLE"),
            desc: t("LIKE_DESC"),
            myImg: response.myUser.profileImage.imageUrl,
            otherUserImg: response.swipedUser.profileImage.imageUrl,
            swipedUserId: response.swipedUser.userId,
          });
        }
      } catch (error) {
        console.error("Swipe işlemi başarısız", error);
      }
    };

    if (quizAnswer === true) {
      handlePostSwipe();
    }
  }, [quizAnswer]);

  const handleOnSwiped = (cardIndex) => {
    if (cardIndex === matches.length - 4) {
      setPage((prevPage) => prevPage + 1);
    } else if (cardIndex === matches.length - 1) {
      setShowMatches(false);
    }
  };
  const handleOnLeftSwipe = async (cardIndex) => {
    const data = {
      swipedUserId: matches[cardIndex].ProfileInfo.userId,
      isLike: false,
      superLikeUsed: false,
    };
    const response = await postSwipe(data);
  };

  const handleOnRightSwipe = async (cardIndex) => {
    setCardIndex(cardIndex);
    setIsSwipingEnabled(true);
    setTimeout(() => {
      setIsSwipingEnabled(false);
    }, 1000);
    setQuizData(matches[cardIndex].CommonTvShowQuestion);
    setShowQuiz(true);
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
    <>
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
                  selectedAbouts={userStore.cardAbouts}
                  selectedInterests={userStore.cardInterests}
                  message={card?.SwipeMessage?.message}
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
              overlayLabels={{
                left: {
                  title: "NOPE",
                  style: {
                    label: {
                      backgroundColor: "red",
                      color: "white",
                      fontSize: 24,
                      borderRadius: 10,
                      padding: 10,
                    },
                    wrapper: {
                      flexDirection: "column",
                      alignItems: "flex-end",
                      justifyContent: "flex-start",
                      marginTop: 20,
                      marginLeft: -20,
                    },
                  },
                },
                right: {
                  title: "LIKE",
                  style: {
                    label: {
                      backgroundColor: "green",
                      color: "white",
                      fontSize: 24,
                      borderRadius: 10,
                      padding: 10,
                    },
                    wrapper: {
                      flexDirection: "column",
                      alignItems: "flex-start",
                      justifyContent: "flex-start",
                      marginTop: 20,
                      marginLeft: 20,
                    },
                  },
                },
              }}
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
        {showQuiz && (
          <Quiz
            quizOpen={showQuiz}
            setQuizOpen={setShowQuiz}
            quiz={quizData}
            setQuizAnswer={setQuizAnswer}
            quizAnswer={quizAnswer}
          />
        )}
      </View>
      <MatchingSheet sheetRef={sheetRef} sheetProps={sheetProps} />
    </>
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
    zIndex: 999,
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
