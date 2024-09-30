import React from "react";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import ProggressBar from "./ProggressBar";
import CustomText from "./CustomText";
import { BlurView } from "expo-blur";
import Plus from "../assets/svg/plus.svg";
import { TouchableOpacity } from "react-native";
import AboutBox from "./AboutBox";

const ProfileCard = () => {
  const selectedAbouts = ["Women", "Istanbul, Turkey"];
  return (
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
          />
          <AboutBox
            text="168 cm (5’ 5’’)"
            selectedBox={selectedAbouts}
            keyName="168 cm (5’ 5’’)"
          />
          <AboutBox
            text="Leo"
            selectedBox={selectedAbouts}
            keyName="Leo"
          />
          <AboutBox
            text="Istanbul, Turkey"
            selectedBox={selectedAbouts}
            keyName="Istanbul, Turkey"
          />
        </View>
      </View>
    </ScrollView>
  );
};

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
  abouts: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  subTitle: {
    fontWeight: "500",
    fontSize: 18,
    lineHeight: 24,
    color: "#000000",
    textAlign: "center",
    marginBottom: 24
  },
});

export default ProfileCard;
