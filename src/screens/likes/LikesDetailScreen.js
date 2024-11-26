import React, { useEffect, useRef, useState } from "react";
import CustomText from "../../components/CustomText";
import { Dimensions, Pressable, StyleSheet, View } from "react-native";
import { getSinglePotentialMatch } from "../../services/Matching/get-single-potential-match";
import ProfileCard from "../../components/ProfileCard";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useUserStore from "../../store/useUserStore";
import Like from "../../assets/svg/likes-passive.svg";
import Cross from "../../assets/svg/cross.svg";
import { postSwipe } from "../../services/Matching/send-swiper";
import { useNavigation } from "@react-navigation/native";
import MatchingSheet from "../../components/MatchingSheet";
import { t } from "i18next";

const LikesDetailScreen = ({ route }) => {
  const { userId, tabIndex } = route.params;
  const insets = useSafeAreaInsets();
  const [userData, setUserData] = useState(null);
  const userStore = useUserStore();
  const navigation = useNavigation();
  const sheetRef = useRef(null);
  const [sheetProps, setSheetProps] = useState(null);
  const [messageSend, setMessageSend] = useState(false);

  useEffect(() => {
    const getProfileCardDetails = async () => {
      const response = await getSinglePotentialMatch(userId);
      setUserData(response.MatchUser.Contents[0]);
    };
    getProfileCardDetails();
  }, []);

  useEffect(() => {
    if (messageSend) {
      navigation.goBack();
    }
  }, [messageSend]);

  const handleOnLeftSwipe = async () => {
    const data = {
      swipedUserId: userId,
      isLike: false,
      superLikeUsed: false,
    };
    const response = await postSwipe(data);
    navigation.goBack();
  };

  const handleOnRightSwipe = async () => {
    const data = {
      swipedUserId: userId,
      isLike: true,
      superLikeUsed: false,
    };
    const response = await postSwipe(data);

    setSheetProps({
      title: t("MATCH_TITLE"),
      desc: t("MATCH_DESC"),
      myImg: response.myUser.profileImage.imageUrl,
      otherUserImg: response.swipedUser.profileImage.imageUrl,
      swipedUserId: response.swipedUser.userId,
    });
    sheetRef.current?.present();
  };

  return (
    <View style={styles.container}>
      {userData && (
        <ProfileCard
          images={userData.ProfileInfo.images}
          insets={insets}
          name={userData.ProfileInfo.name}
          age={userData.ProfileInfo.age}
          distance={userData.ProfileInfo.distance}
          tvShows={userData.ProfileInfo.tvShows}
          id={userData.ProfileInfo.userId}
          selectedAbouts={userStore.cardAbouts}
          selectedInterests={userStore.cardInterests}
          message={userData.SwipeMessage?.message}
        />
      )}
      {tabIndex === 0 && (
        <View style={styles.actionWrapper}>
          <Pressable style={styles.actionBox} onPress={handleOnLeftSwipe}>
            <Cross style={{ color: "#FFAC24" }} />
          </Pressable>
          <Pressable style={styles.actionBox} onPress={handleOnRightSwipe}>
            <Like style={{ color: "#FF524F" }} />
          </Pressable>
        </View>
      )}

      <MatchingSheet
        sheetRef={sheetRef}
        sheetProps={sheetProps}
        setMessageSend={setMessageSend}
      />
    </View>
  );
};

const { height, width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
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
});

export default LikesDetailScreen;
