import * as ImagePicker from "expo-image-picker";
import { t } from "i18next";
import { Alert, Linking, Platform } from "react-native";

const openSettings = () => {
  if (Platform.OS === "ios") {
    Linking.openURL("app-settings:");
  } else {
    Linking.openSettings();
  }
};

export const selectImage = async (allowsEditing = true) => {
  const permissionResult =
    await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (permissionResult.granted === false) {
    Alert.alert(t("ALERT"), t("PERMISSION_CAMERA"), [
      {
        text: t("OK"),
      },
      { text: t("OPEN_SETTINGS"), onPress: () => openSettings() },
    ]);
    return;
  }

  

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: allowsEditing,
    quality: 0.5,
  });

  if (!result.canceled) {
    const uri = result.assets[0].uri;
    const file = await uriToFile(uri);
    const formData = new FormData();
    formData.append("image", {
      uri: file.uri,
      type: file.type,
      name: file.name,
    });
    return { formData, uri };
  }
};

export const uriToFile = async (uri) => {
  const response = await fetch(uri);
  const blob = await response.blob();
  const fileName = uri.split("/").pop();
  const fileType = blob.type;
  const file = {
    uri,
    name: fileName,
    type: fileType,
  };

  return file;
};
