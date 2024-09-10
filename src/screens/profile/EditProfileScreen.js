import React, { useEffect, useState } from "react";
import CustomText from "../../components/CustomText";
import { ScrollView, StyleSheet, View } from "react-native";
import { t } from "i18next";
import PhotoSelect from "../../components/PhotoSelect";
import Button from "../../components/Button";
import { postUserPhotoOrder } from "../../services/User/send-photos-order";
import Input from "../../components/Input";

const EditProfileScreen = () => {
  const [selectedImages, setSelectedImages] = useState([]);

  useEffect(() => {
    const orderPhotos = async () => {
      const data = selectedImages.map((image, index) => ({
        imageId: image.id,
        orderIndex: index,
      }));
      const response = await postUserPhotoOrder(data);
    };
    orderPhotos();
  }, [selectedImages]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <CustomText style={styles.title}>{t("PHOTO")}</CustomText>
      <PhotoSelect
        selectedImages={selectedImages}
        setSelectedImages={setSelectedImages}
      />
      <Button style={{ marginTop: 24, marginBottom: 40 }}>
        {t("VERIFY_PROFILE")}
      </Button>
      <CustomText style={styles.title}>{t("DESCRIPTION")}</CustomText>
      <Input multiline={true} numberOfLines={10} placeholder="Bize bir mesaj bırakın"/>
    </ScrollView>
  );
};

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
    marginBottom: 16
  },
});

export default EditProfileScreen;
