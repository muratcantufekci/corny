import { t } from "i18next";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import RadioButton from "../../components/RadioButton";
import * as SecureStore from "expo-secure-store";
import * as Updates from "expo-updates";

const languagesData = [
  {
    id: "1",
    name: t("TURKISH"),
    code: "tr",
  },
  {
    id: "2",
    name: t("ENGLISH"),
    code: "en",
  },
];

const EditLangugePreferencesScreen = () => {
  const [selectedLanguage, setSelectedLanguage] = useState(
    SecureStore.getItem("userLanguage")
  );
  const initialLanguage = SecureStore.getItem("userLanguage");

  useEffect(() => {
    const postLanguage = async () => {
      await SecureStore.setItemAsync("userLanguage", selectedLanguage);
      await Updates.reloadAsync();
    };
    if (selectedLanguage !== initialLanguage) {
      postLanguage();
    }
  }, [selectedLanguage]);

  return (
    <View style={styles.container}>
      <View style={styles.boxes}>
        {languagesData.map((item) => (
          <RadioButton
            code={item.code}
            text={item.name}
            key={item.id}
            selected={item.code === selectedLanguage ? true : false}
            selectedItemIdSetter={setSelectedLanguage}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    paddingHorizontal: 16,
  },
  boxes: {
    gap: 8,
  },
});

export default EditLangugePreferencesScreen;
