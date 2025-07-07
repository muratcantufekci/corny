import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  Linking,
  Modal,
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
import Like from "../../assets/svg/likes-passive.svg";
import Cross from "../../assets/svg/cross.svg";
import Star from "../../assets/svg/star-purple.svg";
import { getUserAbouts } from "../../services/User/get-user-abouts";
import { Image } from "expo-image";
import CustomText from "../../components/CustomText";
import { t } from "i18next";
import { postSwipe } from "../../services/Matching/send-swiper";
import Quiz from "../../components/Quiz";
import { BottomSheetBackdrop, BottomSheetModal } from "@gorhom/bottom-sheet";
import ArrowUp from "../../assets/svg/arrow-up-circle.svg";
import useUserStore from "../../store/useUserStore";
import MatchingSheet from "../../components/MatchingSheet";
import * as SecureStore from "expo-secure-store";
import WaitlistScreen from "../waitlist/WaitlistScreen";
import AlertSheet from "../../components/AlertSheet";
import { exploreProfiles } from "../../services/Matching/explore-profiles";
import { getSwipeQuestion } from "../../services/Matching/get-swipe-question";
import { getMatchRates } from "../../services/Matching/get-match-rates";
import * as Location from "expo-location";
import { postUserLocation } from "../../services/User/send-location";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { getUserSwipeCount } from "../../services/Matching/get-user-daily-swipe-count";
import Button from "../../components/Button";
import PremiumSheet from "../../components/PremiumSheet";
import PremiumAlertSheet from "../../components/PremiumAlertSheet";
import UtilitySheet from "../../components/UtilitySheet";
import usePremiumPackagesStore from "../../store/usePremiumPackagesStore";
import { mapRevenueCatDataToStaticFormat } from "../../helper/rcDataToStatic";

const registerForPushNotificationsAsync = async (
  setAlertSheetProps,
  sheetRef
) => {
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
  const notificationToken = await SecureStore.getItemAsync(
    "notification_token"
  );

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();

    if (status !== "granted") {
      setAlertSheetProps({
        img: require("../../assets/images/warning.png"),
        title: t("WARNING"),
        desc: t("PERMISSION_NOTIFICATION"),
        btnText: t("OPEN_SETTINGS"),
        btnPress: openSettings,
      });
      sheetRef.current?.present();
      return;
    }

    const response = await allowAllUserNotifications();

    if (!response.isSuccess) {
      console.error("Failed to allow notifications.");
    }
  } else {
    if (!notificationToken) {
      const response = await allowAllUserNotifications();

      if (!response.isSuccess) {
        console.error("Failed to allow notifications.");
      }
    }
  }

  token = (
    await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig.extra.eas.projectId,
    })
  ).data;

  await SecureStore.setItemAsync("notification_token", token);

  const resp = await postExpoPushToken({
    expoPushToken: token,
    deviceId: "",
  });

  return token;
};

const openSettings = () => {
  if (Platform.OS === "ios") {
    Linking.openURL("app-settings:");
  } else {
    Linking.openSettings();
  }
};

const ExploreScreen = ({ route }) => {
  const insets = useSafeAreaInsets();
  const userStore = useUserStore();
  const [expoPushToken, setExpoPushToken] = useState("");
  const [matches, setMatches] = useState([]);
  const [matchRates, setMatchRates] = useState([]);
  const [excludeIds, setExcludeIds] = useState([]);
  const [showMatches, setShowMatches] = useState(true);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizData, setQuizData] = useState(null);
  const [quizAnswer, setQuizAnswer] = useState(null);
  const [isSwipingEnabled, setIsSwipingEnabled] = useState(false);
  const [isRightSwipingEnabled, setIsRightSwipingEnabled] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [page, setPage] = useState(1);
  const [cardIndex, setCardIndex] = useState(0);
  const [swipeLimit, setSwipeLimit] = useState(0);
  const [swipeUsage, setSwipeUsage] = useState(0);
  const [swipeCount, setSwipeCount] = useState(0);
  const swiperRef = useRef(null);
  const sheetRef = useRef(null);
  const alertSheetRef = useRef(null);
  const [sheetProps, setSheetProps] = useState(null);
  const [utilitySheetProps, setUtilitySheetProps] = useState(null);
  const [alertSheetProps, setAlertSheetProps] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [shouldOpenUtilitySheet, setShouldOpenUtilitySheet] = useState(false);
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const premiumSheetRef = useRef(null);
  const premiumAlertSheetRef = useRef(null);
  const utilitySheetRef = useRef(null);
  const premiumStore = usePremiumPackagesStore();
  const superlikeSubscriptionData = mapRevenueCatDataToStaticFormat(
    premiumStore.superlikePackages,
    "superlike"
  );

  const premiumAletSheetProps = {
    img: require("../../assets/images/corny-chair.png"),
    title: t("SHARE_PASSION"),
    desc: t("SHARE_PASSION_DESC"),
    btnText: t("GET_PREMIUM"),
  };

  useEffect(() => {
    getMatches();
  }, [page]);

  useEffect(() => {
    if (route.params?.updated) {
      getMatches();
      navigation.setParams({ updated: undefined });
    }
  }, [isFocused]);

  useEffect(() => {
    registerForPushNotificationsAsync(setAlertSheetProps, alertSheetRef).then(
      (token) => {
        setExpoPushToken(token);
      }
    );
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

    const getUserLocation = async () => {
      const response = await Location.requestForegroundPermissionsAsync();

      if (response.status === "granted") {
        let location = await Location.getCurrentPositionAsync({});

        let reverseGeocode = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        if (reverseGeocode.length > 0) {
          const data = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            city: reverseGeocode[0].region
              ? reverseGeocode[0].region
              : reverseGeocode[0].city,
            isoCountryCode: reverseGeocode[0].isoCountryCode,
          };
          try {
            const res = await postUserLocation(data);
          } catch (error) {
            console.error(error);
          }
        }
      }
    };

    const getUserDailySwipeCount = async () => {
      const response = await getUserSwipeCount();
      setSwipeLimit(response.Limit);
      setSwipeUsage(response.Usage);
      setIsRightSwipingEnabled(
        response.Usage >= response.Limit && !userStore.isUserPremium
          ? true
          : false
      );
    };

    const loadTodaysSwipeCount = async () => {
      const today = new Date().toISOString().split("T")[0];
      const stored = await SecureStore.getItemAsync("dailySwipes");

      if (stored) {
        const { date, count } = JSON.parse(stored);
        setSwipeCount(date === today ? count : 0);
      }
    };

    getAboutMe();
    getUserDailySwipeCount();
    getUserLocation();
    if (!userStore.isUserPremium) {
      loadTodaysSwipeCount();
    }
  }, []);

  useEffect(() => {
    if (quizAnswer?.answer === true) {
      handlePostSwipe(quizAnswer?.isSuperlike, quizAnswer?.isSuperlike && cardIndex);
    }
  }, [quizAnswer]);

  useEffect(() => {
    if (!userStore.isUserPremium && swipeCount > 0 && swipeCount % 20 === 0) {
      premiumAlertSheetRef.current?.present();
    }
  }, [swipeCount]);

  useEffect(() => {
    if (shouldOpenUtilitySheet && utilitySheetProps) {
      utilitySheetRef.current?.present();
      setShouldOpenUtilitySheet(false);
    }
  }, [utilitySheetProps, shouldOpenUtilitySheet]);

  const getMatches = async () => {
    const data = {
      size: 20,
      skipIdList: excludeIds,
      filterIdentifier: await SecureStore.getItemAsync("filter_identifier"),
    };

    const response = await exploreProfiles(data);
    if (page === 1 || route.params?.updated) {
      const userIds = response.profiles.slice(0, 5).map((item) => item.userId);
      const matchRateResponse = await getMatchRates(userIds);
      setMatchRates(matchRateResponse.MatchRates);
    }

    if (route.params?.updated) {
      setMatches(response.profiles);
      swiperRef.current?.jumpToCardIndex(0);
      setPage(1);
      setCardIndex(0);
    } else {
      setMatches((prevData) => [...prevData, ...response.profiles]);
    }
  };

  const handlePostSwipe = async (isSuperlike = false, swipeCardIndex) => {
    setSwipeUsage(swipeUsage + 1);
    if (swipeUsage + 1 >= swipeLimit && !userStore.isUserPremium) {
      setIsRightSwipingEnabled(true);
    }

    const data = {
      swipedUserId:
        matches[isSuperlike ? swipeCardIndex : cardIndex].profileInfo.userId,
      isLike: true,
      superLikeUsed: isSuperlike,
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

      isSuperlike && userStore.setSuperlikeCount(userStore.superlikeCount - 1);
    } catch (error) {
      console.error("Swipe işlemi başarısız", error);
    }
  };

  const handleOnSwiped = async (cardIndex) => {
    if (cardIndex === matches.length - 11) {
      const lastTenIds = matches.slice(-10).map((match) => match.userId);
      setExcludeIds(lastTenIds);
      setPage((prevPage) => prevPage + 1);
    } else if (cardIndex === matches.length - 1) {
      setShowMatches(false);
    }

    if (cardIndex % 5 === 3) {
      const nextFiveCards = matches.slice(cardIndex + 2, cardIndex + 7);
      const nextFiveIds = nextFiveCards.map((card) => card.profileInfo.userId);

      if (nextFiveIds.length) {
        try {
          const response = await getMatchRates(nextFiveIds);

          setMatchRates((prevData) => [...prevData, ...response.MatchRates]);
        } catch (err) {
          console.error("Match rate servisine istek atılamadı:", err);
        }
      }
    }

    if (!userStore.isUserPremium) {
      const newCount = swipeCount + 1;
      setSwipeCount(newCount);

      const today = new Date().toISOString().split("T")[0];
      await SecureStore.setItemAsync(
        "dailySwipes",
        JSON.stringify({ date: today, count: newCount })
      );
    }
  };
  const handleOnLeftSwipe = async (cardIndex) => {
    setIsSwipingEnabled(true);
    setTimeout(() => {
      setIsSwipingEnabled(false);
    }, 500);
    const data = {
      swipedUserId: matches[cardIndex].profileInfo.userId,
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

    const response = await getSwipeQuestion(
      matches[cardIndex].profileInfo.userId
    );
    setQuizData(response.question);
    setShowQuiz(true);
  };

  const handleOnTopSwipe = async (cardIndex) => {
    setCardIndex(cardIndex);
    handlePostSwipe(true, cardIndex);
  };

  const handleOnAbortedSwipe = () => {
    if (swipeUsage >= swipeLimit && !userStore.isUserPremium) {
      setModalVisible(true);
    }
  };

  const getPremiumPressHandler = () => {
    setModalVisible(false);
    premiumSheetRef.current?.present();
  };

  const handleLeftPress = () => {
    if (isSwipingEnabled) {
      return;
    }

    swiperRef.current.swipeLeft();

    setIsButtonDisabled(true);
    setTimeout(() => {
      setIsButtonDisabled(false);
    }, 500);
  };

  const handleRightPress = () => {
    if (isSwipingEnabled || isRightSwipingEnabled) {
      setModalVisible(true);
      return;
    }

    swiperRef.current.swipeRight();

    setIsButtonDisabled(true);
    setTimeout(() => {
      setIsButtonDisabled(false);
    }, 1000);
  };

  const handleSuperlikePress = () => {
    if (isSwipingEnabled || isRightSwipingEnabled) {
      setModalVisible(true);
      return;
    }

    if (userStore.superlikeCount > 0) {
      swiperRef.current.swipeTop();
    } else {
      setUtilitySheetProps({
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
      setShouldOpenUtilitySheet(true);
    }
    setIsButtonDisabled(true);
    setTimeout(() => {
      setIsButtonDisabled(false);
    }, 1000);
  };

  return userStore.waitListStatus ? (
    <WaitlistScreen />
  ) : (
    <>
      <View
        style={{
          marginTop: insets.top + 16,
          flex: 1,
          paddingHorizontal: 16,
          marginBottom: 16,
        }}
      >
        <View style={styles.head}>
          <Pressable
            onPress={() => swiperRef.current.swipeBack()}
            // style={!showMatches && { opacity: 0, pointerEvents: "none" }} geriye alma etkinliği açılınca burası kullanılabilir
            style={{ opacity: 0, pointerEvents: "none" }}
          >
            <Undo />
          </Pressable>
          <Corny />
          <Pressable
            onPress={() => navigation.navigate("Filter", { refresh: true })}
          >
            <Filter />
          </Pressable>
        </View>
        {showMatches && matches.length > 0 && matchRates.length > 0 ? (
          <>
            <Swiper
              cards={matches}
              ref={swiperRef}
              renderCard={(card) => (
                <ProfileCard
                  key={card?.profileInfo.userId}
                  images={card?.profileInfo.images}
                  name={card?.profileInfo.name}
                  age={card?.profileInfo.age}
                  distance={card?.profileInfo.distance}
                  tvShows={card?.profileInfo.tvShows}
                  id={card?.profileInfo.userId}
                  insets={insets}
                  selectedAbouts={userStore.cardAbouts}
                  selectedInterests={userStore.cardInterests}
                  message={card?.SwipeMessage?.message}
                  persentage={
                    matchRates.find(
                      (m) => m.UserId === card?.profileInfo.userId
                    )?.MatchRate ?? null
                  }
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
              onSwipedTop={handleOnTopSwipe}
              disableRightSwipe={isSwipingEnabled || isRightSwipingEnabled}
              disableLeftSwipe={isSwipingEnabled}
              disableTopSwipe={true}
              onSwipedAborted={handleOnAbortedSwipe}
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
                style={styles.actionBoxLittle}
                onPress={handleLeftPress}
                disabled={isButtonDisabled}
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
              <Pressable
                style={styles.actionBoxLittle}
                onPress={handleSuperlikePress}
                disabled={isButtonDisabled}
              >
                <Star />
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
            setShouldOpenUtilitySheet={setShouldOpenUtilitySheet}
            setUtilitySheetProps={setUtilitySheetProps}
          />
        )}
      </View>
      <MatchingSheet sheetRef={sheetRef} sheetProps={sheetProps} />
      {alertSheetProps && (
        <AlertSheet sheetRef={alertSheetRef} sheetProps={alertSheetProps} />
      )}
      <Modal transparent={true} animationType="slide" visible={modalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modal}>
            <CustomText style={styles.modalTitle}>
              {t("OUT_OF_LIKES")}
            </CustomText>
            <CustomText style={styles.modalDesc}>
              {t("LIKE_LIMIT_DESC")}
            </CustomText>
            <View style={styles.btns}>
              <Button variant="primary" onPress={getPremiumPressHandler}>
                {t("GET_PREMIUM")}
              </Button>
              <Button variant="ghost" onPress={() => setModalVisible(false)}>
                {t("CANCEL")}
              </Button>
            </View>
          </View>
        </View>
      </Modal>
      <PremiumAlertSheet
        sheetProps={premiumAletSheetProps}
        sheetRef={premiumAlertSheetRef}
        premiumSheetRef={premiumSheetRef}
      />
      <PremiumSheet sheetRef={premiumSheetRef} />
      {utilitySheetProps && (
        <UtilitySheet
          sheetRef={utilitySheetRef}
          sheetProps={utilitySheetProps}
        />
      )}
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
  actionBoxLittle: {
    width: height / 15.3,
    height: height / 15.3,
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

export default ExploreScreen;
