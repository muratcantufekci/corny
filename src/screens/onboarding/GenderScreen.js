import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import OnboardingHeading from "../../components/OnboardingHeading";
import ProggressBar from "../../components/ProggressBar";
import { t } from "i18next";
import Button from "../../components/Button";
import RadioButton from "../../components/RadioButton";
import { useNavigation } from "@react-navigation/native";
import { postGender } from "../../services/send-gender";

const genders = [
  {
    id: 1,
    gender: t("MAN_GENDER"),
    code: "male",
  },
  {
    id: 2,
    gender: t("WOMAN_GENDER"),
    code: "female",
  },
  {
    id: 3,
    gender: t("NON_BINARY_GENDER"),
    code: "nonbinary",
  },
];

const GenderScreen = ({ route }) => {
  const [seledtedItem, setSelectedItem] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    if (route.params?.disableBack) {
      navigation.setOptions({
        headerLeft: () => null,
      });
    }
  }, [navigation, route.params?.disableBack]);

  const nextBtnPressHandler = async () => {
    const response = await postGender(seledtedItem);

    if (response.isSuccess) {
      navigation.navigate("Birthday");
    }
  };

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
              code={item.code}
              text={item.gender}
              selectedItemIdSetter={setSelectedItem}
              selected={item.code === seledtedItem ? true : false}
            />
          ))}
        </View>
      </View>
      <Button variant="primary" onPress={nextBtnPressHandler}>
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
  genders: {
    gap: 16,
  },
  textArea: {
    marginBottom: 24,
  },
});

export default GenderScreen;
