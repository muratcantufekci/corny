import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import ProggressBar from "../../components/ProggressBar";
import OnboardingHeading from "../../components/OnboardingHeading";
import { t } from "i18next";
import Button from "../../components/Button";
import SelectionBox from "../../components/SelectionBox";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { postUserPhoto } from "../../services/User/send-photo";
import { deleteUserPhoto } from "../../services/User/delete-photo";
import { postUserPhotoOrder } from "../../services/User/send-photos-order";
import { getProfileImages } from "../../services/User/get-profile-images";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { selectImage } from "../../helper/selectImage";

const PhotoScreen = ({ route }) => {
  const [isBtnDisabled, setIsBtnDisaled] = useState(true);
  const [btnVariant, setBtnVariant] = useState("disable");
  const [selectedImages, setSelectedImages] = useState([]);
  const [longPressedIndex, setLongPressesIndex] = useState("");
  const [isShaking, setIsShaking] = useState(false);
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const getProfilePictures = async () => {
      const response = await getProfileImages();

      if (response.isSuccess) {
        setSelectedImages(
          response.images.map((item) => ({
            id: item.imageId,
            uri: item.imageUrl,
          }))
        );
        if (selectedImages.length > 0) {
          setBtnVariant("primary");
          setIsBtnDisaled(false);
        }
      }
    };

    getProfilePictures();
  }, []);

  useEffect(() => {
    if (route.params?.disableBack) {
      navigation.setOptions({
        headerLeft: () => null,
      });
    }
  }, [navigation, route.params?.disableBack]);

  const selectImageHandler = async () => {
    const data = await selectImage()
    const response = await postUserPhoto(data.formData);
    
      if (response.isSuccess) {
        setSelectedImages([
          ...selectedImages,
          { id: response.imageId, uri: response.imageUrl },
        ]);
        setBtnVariant("primary");
        setIsBtnDisaled(false);
      }
  };


  const deleteImage = async (id) => {
    const response = await deleteUserPhoto(id);

    if (response.isSuccess) {
      setSelectedImages(selectedImages.filter((item) => item.id !== id));
    }
  };

  const nextBtnClickHandler = async () => {
    const data = selectedImages.map((image, index) => ({
      imageId: image.id,
      orderIndex: index,
    }));
    const response = await postUserPhotoOrder(data);

    if (response.isSuccess) {
      navigation.navigate("Movie");
    }
  };

  const orderImages = (index) => {
    const newImages = [...selectedImages];
    const temp = newImages[longPressedIndex];
    newImages[longPressedIndex] = newImages[index];
    newImages[index] = temp;
    setSelectedImages(newImages);
    setLongPressesIndex("");
    setIsShaking(false);
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: insets.bottom,
        },
      ]}
    >
      <View>
        <ProggressBar step={3} />
        <OnboardingHeading
          title={t("PHOTO_SCREEN_TITLE")}
          desc={t("PHOTO_SCREEN_DESC")}
          style={styles.textArea}
        />
        <View style={styles.boxes}>
          {Array.from({ length: 6 }).map((_, index) => (
            <SelectionBox
              key={index}
              selectFunc={() => {
                if (
                  longPressedIndex !== "" &&
                  selectedImages.length >= index + 1
                ) {
                  orderImages(index);
                } else {
                  selectImageHandler();
                }
              }}
              deleteFunc={() => deleteImage(selectedImages[index].id)}
              img={
                selectedImages.length >= index + 1
                  ? selectedImages[index].uri
                  : null
              }
              selected={selectedImages.length >= index + 1 ? true : false}
              onLongPress={() => {
                setLongPressesIndex(index);
                setIsShaking(true);
              }}
              isShaking={isShaking}
            />
          ))}
        </View>
      </View>
      <Button
        variant={btnVariant}
        disabled={isBtnDisabled}
        onPress={nextBtnClickHandler}
      >
        {t("NEXT")}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  boxes: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginTop: 32,
  },
});

export default PhotoScreen;
