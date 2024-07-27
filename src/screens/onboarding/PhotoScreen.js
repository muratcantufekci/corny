import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import ProggressBar from "../../components/ProggressBar";
import OnboardingHeading from "../../components/OnboardingHeading";
import { t } from "i18next";
import Button from "../../components/Button";
import SelectionBox from "../../components/SelectionBox";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";

const PhotoScreen = () => {
  const [isBtnDisabled, setIsBtnDisaled] = useState(true);
  const [btnVariant, setBtnVariant] = useState("disable");
  const [selectedImages, setSelectedImages] = useState([]);
  const navigation = useNavigation();

  const selectImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImages([...selectedImages,result.assets[0].uri]);
      setBtnVariant("primary")
      setIsBtnDisaled(false)
    }
  };

  const nextBtnClickHandler = () => {
    navigation.navigate("Movie");
  }

  return (
    <View style={styles.container}>
      <View>
        <ProggressBar step={3} />
        <OnboardingHeading
          title={t("PHOTO_SCREEN_TITLE")}
          desc={t("PHOTO_SCREEN_DESC")}
          style={styles.textArea}
        />
        <View style={styles.boxes}>
          {Array.from({ length: 6 }).map((_, index) => (
            <SelectionBox key={index} selectFunc={selectImage} img={selectedImages.length >= index + 1 ? selectedImages[index] : null} selected={selectedImages.length >= index + 1 ? true : false}/>
          ))}
        </View>
      </View>
      <Button variant={btnVariant} disabled={isBtnDisabled} onPress={nextBtnClickHandler}>
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
