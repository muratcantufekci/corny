import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import OnboardingHeading from "../../components/OnboardingHeading";
import ProggressBar from "../../components/ProggressBar";
import { t } from "i18next";
import Button from "../../components/Button";
import RadioButton from "../../components/RadioButton";

const genders = [
  {
    id: 1,
    gender: t("MAN_GENDER"),
  },
  {
    id: 2,
    gender: t("WOMAN_GENDER"),
  },
  {
    id: 3,
    gender: t("NON_BINARY_GENDER"),
  },
];

const GenderScreen = () => {
  const [seledtedItemId, setSelectedItemId] = useState(null);
  return (
    <View style={styles.container}>
      <View>
        <ProggressBar step={5} />
        <OnboardingHeading
          title={t("GENDER_SCREEN_TITLE")}
          desc={t("GENDER_SCREEN_DESC")}
          style={styles.textArea}
        />
        <View style={styles.genders}>
          {genders.map((item) => (
            <RadioButton
              key={item.id}
              id={item.id}
              text={item.gender}
              selectedItemIdSetter={setSelectedItemId}
              selected={item.id === seledtedItemId ? true : false}
            />
          ))}
        </View>
      </View>
      <Button variant="primary">{t("NEXT")}</Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  genders: {
    gap: 16,
  },
  textArea: {
    marginBottom: 24,
  },
});

export default GenderScreen;
