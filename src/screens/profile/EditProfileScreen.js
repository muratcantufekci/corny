import React, { useEffect, useState } from "react";
import CustomText from "../../components/CustomText";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { t } from "i18next";
import PhotoSelect from "../../components/PhotoSelect";
import Button from "../../components/Button";
import { postUserPhotoOrder } from "../../services/User/send-photos-order";
import useUserStore from "../../store/useUserStore";
import Arrow from "../../assets/svg/arrow-left.svg";
import { getUserTvShows } from "../../services/TvShow/get-user-tv-shows";
import { getUserAbouts } from "../../services/User/get-user-abouts";

const MenuItem = ({name, values}) => {
  return(
    <TouchableOpacity style={styles.menuItem}>
      <CustomText style={styles.menuItemText}>{t(`${name.toUpperCase()}`)}</CustomText>
      <View>
        <CustomText>{values?.map(value => (value))}</CustomText>
        <Arrow style={styles.icon} />
      </View>
    </TouchableOpacity>
  )
};

const EditProfileScreen = () => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedMovies, setSelectedMovies] = useState([]);
  const [userAbouts, setUserAbouts] = useState([]);
  const userStore = useUserStore();

  useEffect(() => {
    const userTvShows = async () => {
      const response = await getUserTvShows();
      setSelectedMovies(response.tvShows);
    };
    const userAbouts = async () => {
      const response = await getUserAbouts()
      setUserAbouts(response.userAbouts)
      
    }
    userTvShows();
    userAbouts()
  }, []);

  useEffect(() => {
    const orderPhotos = async () => {
      const data = selectedImages.map((image, index) => ({
        imageId: image.id,
        orderIndex: index,
      }));
      const response = await postUserPhotoOrder(data);

      userStore.setUserAccountDetails({
        profilePicture: selectedImages[0]?.uri,
      });
    };
    orderPhotos();
  }, [selectedImages]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={{ marginBottom: 24 }}>
        <CustomText style={styles.title}>{t("PHOTO")}</CustomText>
        <PhotoSelect
          selectedImages={selectedImages}
          setSelectedImages={setSelectedImages}
        />
      </View>
      <Button>{t("VERIFY_PROFILE")}</Button>
      <View style={{ marginVertical: 40 }}>
        <CustomText style={styles.title}>{t("QUESTIONS")}</CustomText>
        <MenuItem name="Test"/>
      </View>
      <View style={{ marginBottom: 40 }}>
        <CustomText style={styles.title}>
          {t("MY_FAVORITE_TV_SHOWS")}
        </CustomText>
        <View style={styles.movieBoxes}>
          {selectedMovies.map((item, index) => {
            if (index <= 5) {
              return (
                <View key={item.id} style={styles.movieBox}>
                  <Image
                    source={{ uri: item.poster }}
                    style={styles.movieImg}
                  />
                </View>
              );
            }
          })}
        </View>
        <Button>{t("SEE_TV_SHOWS")}</Button>
      </View>
      <View style={{gap: 8, marginBottom: 24}}>
        <CustomText style={styles.title}>{t("ABOUT_ME")}</CustomText>
        {userAbouts.map((item, index) => (
          <MenuItem key={index} name={item.title} values={item.values}/>
        ))}
      </View>
    </ScrollView>
  );
};

const boxWidth = (Dimensions.get("window").width - 64) / 3;
const boxHeight = Dimensions.get("window").height / 5.5;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
  },
  title: {
    fontWeight: "500",
    fontSize: 18,
    lineHeight: 24,
    color: "#000000",
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#F4F4F5",
  },
  menuItemText: {
    fontWeight: "500",
    fontSize: 18,
    lineHeight: 24,
    color: "#000000",
  },
  icon: {
    transform: [{ rotate: "180deg" }],
  },
  movieBoxes: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginBottom: 24,
  },
  movieBox: {
    width: boxWidth,
    height: boxHeight,
  },
  movieImg: {
    width: "100%",
    height: "100%",
    overflow: "hidden",
    borderRadius: 10,
  },
});

export default EditProfileScreen;
