import React from "react";
import { Dimensions, Image, StyleSheet, View } from "react-native";
import CustomText from "../../../components/CustomText";
import useChatRoomsStore from "../../../store/useChatRoomsStore";
import { t } from "i18next";

const EpisodeSection = ({ image, displayName }) => {
  const chatRoomsStore = useChatRoomsStore();
  return (
    <View style={styles.episode}>
      <Image
        source={require("../../../assets/images/noise.png")}
        style={styles.episodeNoise}
      />
      <CustomText style={styles.episodeText}>
        {`${t("SEASON")} - ${chatRoomsStore.myChatUser.myDisplayName} ${t(
          "AND"
        )} ${displayName} ${t("MATCHED")}`}
      </CustomText>
      <View style={styles.episodeImgs}>
        <Image
          source={{ uri: chatRoomsStore.myChatUser.myProfileImage.imageUrl }}
          style={[styles.episodeImg, styles.episodeFirstImg]}
        />
        <Image
          source={{ uri: image }}
          style={[styles.episodeImg, styles.episodeSecondImg]}
        />
        <Image
          source={require("../../../assets/images/beverage.png")}
          style={styles.episodeBeverage}
        />
        <Image
          source={require("../../../assets/images/ticket.png")}
          style={styles.episodeTicket}
        />
      </View>
    </View>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  episode: {
    backgroundColor: "#FF524F",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 50,
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
    marginBottom: 8,
    overflow: "hidden",
  },
  episodeText: {
    fontWeight: "600",
    fontSize: 16,
    lineHeight: 20,
    color: "#FFFFFF",
    flex: 1,
  },
  episodeImgs: {
    position: "relative",
    width: "40%",
    height: "100%",
    zIndex: 3,
  },
  episodeImg: {
    width: 65,
    height: 75,
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
    borderRadius: 6,
    position: "absolute",
    top: -10,
  },
  episodeFirstImg: {
    right: 70,
    transform: [{ rotate: "-13deg" }],
    zIndex: 3,
  },
  episodeSecondImg: {
    right: 5,
    transform: [{ rotate: "13deg" }],
    zIndex: 2,
  },
  episodeNoise: {
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    opacity: 0.3,
    zIndex: 1,
    width: width - 32,
  },
  episodeBeverage: {
    position: "absolute",
    top: -50,
    right: 35,
    zIndex: 2,
  },
  episodeTicket: {
    position: "absolute",
    top: 28,
    right: 32,
    zIndex: 4,
  },
});

export default EpisodeSection;
