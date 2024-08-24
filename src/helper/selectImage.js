import * as ImagePicker from "expo-image-picker";

export const selectImage = async () => {
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
