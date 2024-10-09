import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import ProggressBar from "../../components/ProggressBar";
import OnboardingHeading from "../../components/OnboardingHeading";
import { t } from "i18next";
import Button from "../../components/Button";
import { useNavigation } from "@react-navigation/native";
import { postUserPhotoOrder } from "../../services/User/send-photos-order";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import PhotoSelect from "../../components/PhotoSelect";

const PhotoScreen = ({ route }) => {
  const [isBtnDisabled, setIsBtnDisaled] = useState(true);
  const [btnVariant, setBtnVariant] = useState("disable");
  const [selectedImages, setSelectedImages] = useState([]);
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (route.params?.disableBack) {
      navigation.setOptions({
        headerLeft: () => null,
      });
    }
  }, [navigation, route.params?.disableBack]);

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
        <ProggressBar step={3} totalStep={7}/>
        <OnboardingHeading
          title={t("PHOTO_SCREEN_TITLE")}
          desc={t("PHOTO_SCREEN_DESC")}
          style={styles.textArea}
        />
        <PhotoSelect
          selectedImages={selectedImages}
          setSelectedImages={setSelectedImages}
          setBtnVariant={setBtnVariant}
          setIsBtnDisaled={setIsBtnDisaled}
        />
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
    paddingHorizontal: 16
  },
  textArea: {
    marginBottom: 32,
  }
});

export default PhotoScreen;
