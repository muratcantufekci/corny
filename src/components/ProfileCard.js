import React from "react";
import { Dimensions, Image, ScrollView, StyleSheet, View } from "react-native";
import ProggressBar from "./ProggressBar";
import CustomText from "./CustomText";
import { BlurView } from "expo-blur";
import Plus from "../assets/svg/plus.svg";
import { TouchableOpacity } from "react-native";
import AboutBox from "./AboutBox";
import Like from "../assets/svg/likes-passive.svg";
import Cross from "../assets/svg/cross.svg";

const ProfileCard = () => {
  const selectedAbouts = ["Leo", "Istanbul, Turkey"];
  const selectedInterests = ["Sense of humor", "Beaches"];
  return (
    <>
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.proggressBar}>
        <ProggressBar step={3} totalStep={6} fromProfileCard />
      </View>
      <Image
        source={require("../assets/images/girl5.png")}
        style={styles.img}
      />
      <View style={styles.infoContainer}>
        <View style={styles.text}>
          <CustomText style={styles.nameText}>Lydia, 30</CustomText>
          <View>
            <CustomText style={styles.distanceText}>3.0 km</CustomText>
          </View>
        </View>
        <BlurView intensity={100} style={styles.blurContainer}>
          <CustomText style={styles.favoritesText}>
            All time favorites
          </CustomText>
          <View style={styles.tvShows}>
            <Image
              source={{
                uri: "https://media.themoviedb.org/t/p/w220_and_h330_face/fk13FHRcNTBvTXXqDtQaeb5eGjO.jpg",
              }}
              style={styles.favoriteImage}
            />
            <Image
              source={{
                uri: "https://media.themoviedb.org/t/p/w220_and_h330_face/fk13FHRcNTBvTXXqDtQaeb5eGjO.jpg",
              }}
              style={styles.favoriteImage}
            />
            <Image
              source={{
                uri: "https://media.themoviedb.org/t/p/w220_and_h330_face/fk13FHRcNTBvTXXqDtQaeb5eGjO.jpg",
              }}
              style={styles.favoriteImage}
            />
            <Image
              source={{
                uri: "https://media.themoviedb.org/t/p/w220_and_h330_face/fk13FHRcNTBvTXXqDtQaeb5eGjO.jpg",
              }}
              style={styles.favoriteImage}
            />
            <Image
              source={{
                uri: "https://media.themoviedb.org/t/p/w220_and_h330_face/fk13FHRcNTBvTXXqDtQaeb5eGjO.jpg",
              }}
              style={styles.favoriteImage}
            />
            <TouchableOpacity style={styles.more}>
              <Plus style={{ color: "white" }} />
            </TouchableOpacity>
          </View>
        </BlurView>
      </View>
      <View style={styles.aboutContainer}>
        <CustomText style={styles.subTitle}>About me</CustomText>
        <View style={styles.abouts}>
          <AboutBox
            text="Woman"
            selectedBox={selectedAbouts}
            keyName="Women"
            disabled={true}
          />
          <AboutBox
            text="168 cm (5’ 5’’)"
            selectedBox={selectedAbouts}
            keyName="168 cm (5’ 5’’)"
            disabled={true}
          />
          <AboutBox
            text="Leo"
            selectedBox={selectedAbouts}
            keyName="Leo"
            disabled={true}
          />
          <AboutBox
            text="Istanbul, Turkey"
            selectedBox={selectedAbouts}
            keyName="Istanbul, Turkey"
            disabled={true}
          />
        </View>
      </View>
      <View style={[styles.aboutBox, { backgroundColor: "#FF524F" }]}>
        <Image
          source={require("../assets/images/noise.png")}
          style={styles.aboutBoxNoise}
        />
        <CustomText style={styles.subTitle}>My guilty pleasure is</CustomText>
        <CustomText style={styles.aboutBoxDesc}>Fast and Furious</CustomText>
      </View>
      <View style={styles.interestContainer}>
        <CustomText style={styles.subTitle}>Interests</CustomText>
        <View style={styles.abouts}>
          <AboutBox
            text="Music"
            selectedBox={selectedInterests}
            keyName="Music"
            disabled={true}
          />
          <AboutBox
            text="Swimming"
            selectedBox={selectedInterests}
            keyName="Swimming"
            disabled={true}
          />
          <AboutBox
            text="Beaches"
            selectedBox={selectedInterests}
            keyName="Beaches"
            disabled={true}
          />
          <AboutBox
            text="Sense of humor"
            selectedBox={selectedInterests}
            keyName="Sense of humor"
            disabled={true}
          />
        </View>
      </View>
      <View style={styles.aboutBoxes}>
        <View style={[styles.aboutBox, { backgroundColor: "#FFBD51" }]}>
          <Image
            source={require("../assets/images/noise.png")}
            style={styles.aboutBoxNoise}
          />
          <CustomText style={styles.subTitle}>Last Watched Movie</CustomText>
          <CustomText style={styles.aboutBoxDesc}>Poor Things</CustomText>
        </View>
        <View style={[styles.aboutBox, { backgroundColor: "#8D85FF" }]}>
          <Image
            source={require("../assets/images/noise.png")}
            style={styles.aboutBoxNoise}
          />
          <CustomText style={styles.subTitle}>Dream Vacation</CustomText>
          <CustomText style={styles.aboutBoxDesc}>
            New Zealand and Bali
          </CustomText>
        </View>
        <View style={[styles.aboutBox, { backgroundColor: "#FF6FF6" }]}>
          <Image
            source={require("../assets/images/noise.png")}
            style={styles.aboutBoxNoise}
          />
          <CustomText style={styles.subTitle}>
            Current Series Obsession
          </CustomText>
          <CustomText style={styles.aboutBoxDesc}>Abbot Elementary</CustomText>
        </View>
      </View>
    </ScrollView>
    <View style={styles.actionWrapper}>
        <View style={styles.actionBox}>
          <Cross style={{color: "#FFAC24"}} />
        </View>
        <View style={styles.actionBox}>
          <Like style={{color: "#FF524F"}} />
        </View>
      </View>
    </>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  proggressBar: {
    position: "absolute",
    top: 0,
    zIndex: 2,
    width: "100%",
    paddingHorizontal: 20,
  },
  img: {
    width: "100%",
    height: 560,
    borderRadius: 12,
  },
  infoContainer: {
    position: "absolute",
    width: "100%",
    paddingHorizontal: 8,
    top: 400,
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
  },
  distanceText: {
    fontWeight: "500",
    fontSize: 16,
    lineHeight: 24,
    color: "#FFFFFF",
  },
  blurContainer: {
    marginTop: 14,
    borderRadius: 12,
    overflow: "hidden",
    paddingHorizontal: 24,
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
    height: 108,
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
  actionWrapper: {
    position: "absolute",
    bottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    width: "100%"
  },
  actionBox: {
    width: 64,
    height: 64,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000000"
  }
});

export default ProfileCard;
