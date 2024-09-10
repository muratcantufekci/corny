import React, { useEffect, useState } from "react";
import SelectionBox from "./SelectionBox";
import { StyleSheet, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { getProfileImages } from "../services/User/get-profile-images";
import { selectImage } from "../helper/selectImage";
import { postUserPhoto } from "../services/User/send-photo";
import { deleteUserPhoto } from "../services/User/delete-photo";

const PhotoSelect = ({
  selectedImages,
  setSelectedImages,
  setBtnVariant,
  setIsBtnDisaled,
}) => {
  const [longPressedIndex, setLongPressesIndex] = useState("");
  const [isShaking, setIsShaking] = useState(false);

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
        if (response.images.length > 0) {
          setBtnVariant && setBtnVariant("primary");
          setIsBtnDisaled && setIsBtnDisaled(false);
        }
      }
    };

    getProfilePictures();
  }, []);

  const selectImageHandler = async () => {
    const data = await selectImage();
    const response = await postUserPhoto(data.formData);

    if (response.isSuccess) {
      setSelectedImages([
        ...selectedImages,
        { id: response.imageId, uri: response.imageUrl },
      ]);
      setBtnVariant && setBtnVariant("primary");
      setIsBtnDisaled && setIsBtnDisaled(false);
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

  const deleteImage = async (id) => {
    const response = await deleteUserPhoto(id);

    if (response.isSuccess) {
      setSelectedImages(selectedImages.filter((item) => item.id !== id));
    }
  };
  return (
    <View style={styles.boxes}>
      {Array.from({ length: 6 }).map((_, index) => (
        <SelectionBox
          key={index}
          selectFunc={() => {
            if (longPressedIndex !== "" && selectedImages.length >= index + 1) {
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
  ); 
};

const styles = StyleSheet.create({
  boxes: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
});

export default PhotoSelect;
