import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  Image as Img,
  ActivityIndicator,
} from "react-native";
import ProggressBar from "./ProggressBar";
import CustomText from "./CustomText";
import { BlurView } from "expo-blur";
import Plus from "../assets/svg/plus.svg";
import { TouchableOpacity } from "react-native";
import AboutBox from "./AboutBox";
import * as Haptics from "expo-haptics";
import { t } from "i18next";
import { getUserAboutsById } from "../services/Matching/get-user-abouts-by-id";
import { Image } from "expo-image";
import { BottomSheetBackdrop, BottomSheetModal } from "@gorhom/bottom-sheet";
import { getUserTvShowsById } from "../services/Matching/get-user-tvshows-by-id";
import Close from "../assets/svg/close-circle-wrong.svg";
import { FlatList } from "react-native-gesture-handler";

const { width, height } = Dimensions.get("window");

const ProfileCard = ({
  images,
  name,
  age,
  distance,
  tvShows,
  id,
  insets,
  selectedAbouts,
  selectedInterests,
  message,
  persentage,
  showRate = true,
}) => {
  const [step, setStep] = useState(1);
  const [userInfo, setUserInfo] = useState(null);
  const [userAllTvShows, setUserAllTvShows] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [messageVisible, setMessageVisible] = useState(true);
  const screenWidth = Dimensions.get("window").width;
  const sheetRef = useRef(null);

  useEffect(() => {
    const userAbouts = async () => {
      const response = await getUserAboutsById(id);
      setUserInfo(response);
    };
    userAbouts();
  }, []);

  const handlePress = (event) => {
    const touchX = event.nativeEvent.locationX;

    if (touchX < screenWidth / 2) {
      if (step > 1) {
        setStep((prevStep) => Math.max(prevStep - 1, 1));
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      }
    } else {
      if (step < images.length) {
        setStep((prevStep) => Math.min(prevStep + 1, images.length));
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      }
    }
  };

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        style={{ paddingTop: insets.top }}
        {...props}
      />
    ),
    []
  );

  const seeAllTvShowsHandler = async () => {
    if (page <= totalPage && !loading) {
      setLoading(true);
      const response = await getUserTvShowsById(id, page);
      setUserAllTvShows((prevShows) => [
        ...prevShows,
        ...response.data.Contents,
      ]);
      setTotalPage(response.data.TotalPages);
      setPage(page + 1);
      setLoading(false);
    }
  };

  return (
    <View style={{ height: (height - insets.bottom) / 1.26 }}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        <Pressable style={{ backgroundColor: "white" }}>
          <>
            <View style={styles.proggressBar}>
              <ProggressBar
                step={step}
                totalStep={images && images.length}
                fromProfileCard
              />
            </View>
            {showRate && (
              <View style={styles.matchRate}>
                <Image
                  source={require("../assets/images/popcorn.jpeg")}
                  style={styles.matchRateImg}
                />
                <View style={styles.matchRateTextWrapper}>
                  <CustomText style={styles.matchRatePercentage}>
                    %{persentage}
                  </CustomText>
                  <CustomText style={styles.matchRateText}>
                    {t("MATCH")}
                  </CustomText>
                </View>
              </View>
            )}

            <Pressable onPress={handlePress}>
              <Image
                source={{
                  uri: images?.length > 0 && images[step - 1].imageUrl,
                }}
                style={styles.img}
              />
            </Pressable>
            {message && messageVisible && (
              <View
                style={[
                  styles.messageContainer,
                  { top: (height + insets.bottom) / 2.6 },
                ]}
              >
                <TouchableOpacity
                  style={styles.messageClose}
                  onPress={() => setMessageVisible(false)}
                >
                  <Close />
                </TouchableOpacity>
                <CustomText style={styles.message} numberOfLines={2}>
                  {message}
                </CustomText>
              </View>
            )}
            <View
              style={[
                styles.infoContainer,
                { top: (height + insets.bottom) / 2.2 },
              ]}
            >
              <View style={styles.text}>
                <CustomText style={styles.nameText}>
                  {name}, {age}
                </CustomText>
                <View>
                  <CustomText style={styles.distanceText}>
                    {distance} km
                  </CustomText>
                </View>
              </View>
              <BlurView
                intensity={100}
                style={styles.blurContainer}
                experimentalBlurMethod="dimezisBlurView"
              >
                <CustomText style={styles.favoritesText}>
                  All time favorites
                </CustomText>
                <View style={styles.tvShows}>
                  {tvShows &&
                    tvShows.map((item) => (
                      <Image
                        key={item.id}
                        source={{
                          uri: item.poster,
                        }}
                        style={styles.favoriteImage}
                      />
                    ))}
                  <TouchableOpacity
                    style={styles.more}
                    onPress={() => {
                      sheetRef.current?.present();
                      seeAllTvShowsHandler();
                    }}
                  >
                    <Plus style={{ color: "white" }} />
                  </TouchableOpacity>
                </View>
              </BlurView>
            </View>
            <View style={styles.aboutContainer}>
              <CustomText style={styles.subTitle}>{t("ABOUT_ME")}</CustomText>
              <View style={styles.abouts}>
                <AboutBox
                  text={t(`${userInfo?.gender?.toUpperCase()}`)}
                  selectedBox={selectedAbouts}
                  keyName={userInfo?.gender}
                  disabled={true}
                />
                <AboutBox
                  text={userInfo?.city}
                  selectedBox={selectedAbouts}
                  keyName={userInfo?.city}
                  disabled={true}
                />
                {userInfo?.userAbouts.map((userAbout) => {
                  if (
                    userAbout.title !== "Interest" &&
                    userAbout.title !== "DreamVacation" &&
                    userAbout.title !== "GuiltyPleasure" &&
                    userAbout.title !== "CurrentObsession" &&
                    userAbout.title !== "LastWatched"
                  ) {
                    return userAbout.values.map((item) => (
                      <AboutBox
                        key={item}
                        text={t(`${item}`)}
                        selectedBox={selectedAbouts}
                        keyName={item}
                        disabled={true}
                      />
                    ));
                  }
                  return null;
                })}
              </View>
            </View>
            {userInfo?.userAbouts.find(
              (item) => item.title === "GuiltyPleasure"
            )?.values?.length > 0 && (
              <View style={[styles.aboutBox, { backgroundColor: "#FF524F" }]}>
                <Img
                  source={require("../assets/images/noise.png")}
                  style={styles.aboutBoxNoise}
                  resizeMode="cover"
                />
                <CustomText style={styles.subTitle}>
                  {t("MY_GUILTYPLEASURE")}
                </CustomText>
                {userInfo?.userAbouts.map((item) => {
                  if (item.title === "GuiltyPleasure") {
                    return (
                      <CustomText key={item} style={styles.aboutBoxDesc}>
                        {item.values[0]}
                      </CustomText>
                    );
                  }
                })}
              </View>
            )}
            {userInfo?.userAbouts.find((item) => item.title === "Interest")
              ?.values?.length > 0 && (
              <View style={styles.interestContainer}>
                <CustomText style={styles.subTitle}>{t("INTEREST")}</CustomText>
                <View style={styles.abouts}>
                  {userInfo?.userAbouts.map((userAbout) => {
                    if (userAbout.title === "Interest") {
                      return userAbout.values.map((item, index) => (
                        <AboutBox
                          key={item + index}
                          text={t(`${item}`)}
                          selectedBox={selectedInterests}
                          keyName={item}
                          disabled={true}
                        />
                      ));
                    }
                    return null;
                  })}
                </View>
              </View>
            )}
            <View style={styles.aboutBoxes}>
              {userInfo?.userAbouts.find((item) => item.title === "LastWatched")
                ?.values?.length > 0 && (
                <View style={[styles.aboutBox, { backgroundColor: "#FFBD51" }]}>
                  <Img
                    source={require("../assets/images/noise.png")}
                    style={styles.aboutBoxNoise}
                    resizeMode="cover"
                  />
                  <CustomText style={styles.subTitle}>
                    {t("LAST_WATCHED_MOVIE")}
                  </CustomText>
                  {userInfo?.userAbouts.map((item) => {
                    if (item.title === "LastWatched") {
                      return (
                        <CustomText key={item} style={styles.aboutBoxDesc}>
                          {item.values[0]}
                        </CustomText>
                      );
                    }
                  })}
                </View>
              )}

              {userInfo?.userAbouts.find(
                (item) => item.title === "DreamVacation"
              )?.values?.length > 0 && (
                <View style={[styles.aboutBox, { backgroundColor: "#8D85FF" }]}>
                  <Img
                    source={require("../assets/images/noise.png")}
                    style={styles.aboutBoxNoise}
                    resizeMode="cover"
                  />
                  <CustomText style={styles.subTitle}>
                    {t("DREAMVACATION")}
                  </CustomText>
                  {userInfo?.userAbouts.map((item) => {
                    if (item.title === "DreamVacation") {
                      return (
                        <CustomText key={item} style={styles.aboutBoxDesc}>
                          {item.values[0]}
                        </CustomText>
                      );
                    }
                  })}
                </View>
              )}

              {userInfo?.userAbouts.find(
                (item) => item.title === "CurrentObsession"
              )?.values?.length > 0 && (
                <View style={[styles.aboutBox, { backgroundColor: "#FF6FF6" }]}>
                  <Img
                    source={require("../assets/images/noise.png")}
                    style={styles.aboutBoxNoise}
                    resizeMode="cover"
                  />
                  <CustomText style={styles.subTitle}>
                    {t("CURRENT_SERIES_OBSESSION")}
                  </CustomText>
                  {userInfo?.userAbouts.map((item) => {
                    if (item.title === "CurrentObsession") {
                      return (
                        <CustomText key={item} style={styles.aboutBoxDesc}>
                          {item.values[0]}
                        </CustomText>
                      );
                    }
                  })}
                </View>
              )}
            </View>
          </>
        </Pressable>
      </ScrollView>
      <BottomSheetModal
        ref={sheetRef}
        snapPoints={["80%"]}
        index={0}
        backdropComponent={renderBackdrop}
      >
        <View style={styles.movieBoxes}>
          <CustomText style={styles.movieSheetTitle}>
            All Time Favorites
          </CustomText>
          <FlatList
            columnWrapperStyle={styles.movieContainer}
            data={userAllTvShows}
            nestedScrollEnabled={true}
            renderItem={({ item }) => (
              <View style={styles.movieBox}>
                <Image
                  source={{ uri: item.poster }}
                  style={styles.movieBoxImg}
                />
              </View>
            )}
            keyExtractor={(item) => item.id}
            numColumns={3}
            onEndReached={seeAllTvShowsHandler}
            onEndReachedThreshold={0.6}
            ListFooterComponent={loading && <ActivityIndicator />}
          />
        </View>
      </BottomSheetModal>
    </View>
  );
};

const boxWidth = (Dimensions.get("window").width - 64) / 3;
const boxHeight = Dimensions.get("window").height / 5.5;

const styles = StyleSheet.create({
  proggressBar: {
    position: "absolute",
    top: 0,
    zIndex: 2,
    width: "100%",
    paddingHorizontal: 20,
    alignItems: "center",
  },
  matchRate: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    position: "absolute",
    top: 30,
    right: 10,
    zIndex: 2,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 8,
    overflow: "hidden",
  },
  matchRateImg: {
    width: 40,
    height: 40,
  },
  matchRatePercentage: {
    fontWeight: "700",
    fontSize: 18,
    color: "black",
  },
  matchRateText: {
    fontWeight: "500",
    fontSize: 12,
    color: "black",
  },
  img: {
    width: "100%",
    height: height / 1.54,
    borderRadius: 12,
  },
  messageContainer: {
    position: "absolute",
    padding: 10,
    borderWidth: 1,
    borderColor: "#FCE89E",
    backgroundColor: "#FCE89E",
    left: 20,
    borderRadius: 16,
    borderBottomLeftRadius: 0,
    maxWidth: "90%",
  },
  messageClose: {
    position: "absolute",
    right: -10,
    top: -10,
    width: 30,
    height: 30,
  },
  message: {
    fontWeight: "500",
    fontSize: 12,
    color: "black",
  },
  infoContainer: {
    position: "absolute",
    width: "100%",
    paddingHorizontal: 8,
  },
  text: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  nameText: {
    fontWeight: "600",
    fontSize: 26,
    lineHeight: 32,
    color: "#FFFFFF",
    textShadowColor: "rgba(0, 0, 0, 1)",
    textShadowOffset: { width: -2, height: 2 },
    textShadowRadius: 5,
    elevation: 5,
  },
  distanceText: {
    fontWeight: "500",
    fontSize: 16,
    lineHeight: 24,
    color: "#FFFFFF",
    textShadowColor: "rgba(0, 0, 0, 1)",
    textShadowOffset: { width: -2, height: 2 },
    textShadowRadius: 5,
    elevation: 5,
  },
  blurContainer: {
    marginTop: 14,
    borderRadius: 12,
    overflow: "hidden",
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 46,
    backgroundColor: "#9F9F9F33",
  },
  favoritesText: {
    fontWeight: "500",
    fontSize: 18,
    lineHeight: 24,
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 8,
  },
  favoriteImage: {
    width: 45,
    height: 55,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FFFFFF",
  },
  tvShows: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  more: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000000",
    borderRadius: 999,
  },
  aboutContainer: {
    marginTop: 70,
  },
  interestContainer: {
    marginTop: 56,
  },
  abouts: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    flexWrap: "wrap",
    marginBottom: 56,
    marginTop: 24,
  },
  aboutBoxes: {
    gap: 16,
    marginBottom: 125,
  },
  aboutBox: {
    position: "relative",
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 12,
    overflow: "hidden",
  },
  aboutBoxNoise: {
    position: "absolute",
    top: 0,
    left: 0,
    opacity: 0.3,
    zIndex: 1,
    width: width - 32,
  },
  aboutBoxDesc: {
    fontWeight: "500",
    fontSize: 24,
    lineHeight: 24,
    color: "#000000",
    textAlign: "center",
  },
  subTitle: {
    fontWeight: "500",
    fontSize: 18,
    lineHeight: 24,
    color: "#000000",
    textAlign: "center",
  },
  movieBoxes: {
    marginTop: 24,
    paddingBottom: 40,
    paddingHorizontal: 16,
    flex: 1,
  },
  movieSheetTitle: {
    fontWeight: "500",
    fontSize: 24,
    lineHeight: 32,
    color: "#000000",
    textAlign: "center",
    marginBottom: 16,
  },
  movieContainer: {
    gap: 16,
  },
  movieBox: {
    width: boxWidth,
    height: boxHeight,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
  },
  movieBoxImg: {
    width: "100%",
    height: "100%",
  },
});

export default ProfileCard;
