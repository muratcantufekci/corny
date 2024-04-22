import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import * as ImagePicker from "expo-image-picker"; // expo-image-picker yerine expo kullanılır

const SelectionBox = ({ isMovie, selectMovie }) => {
  const [selectedImage, setSelectedImage] = useState(null);

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
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, selectedImage ? styles.noDashedBorder : ""]}
      onPress={isMovie ? selectMovie : selectImage}
    >
      {selectedImage ? (
        <Image source={{ uri: selectedImage }} style={styles.image} />
      ) : (
        <Text style={styles.icon}>+</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 120,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderRadius: 8,
    borderColor: "black",
    borderStyle: "dashed",
    overflow: "hidden",
  },
  noDashedBorder: {
    borderStyle: "solid",
  },
  icon: {
    fontSize: 24,
    fontWeight: "600",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});

export default SelectionBox;
