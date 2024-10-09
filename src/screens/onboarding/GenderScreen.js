import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import OnboardingHeading from "../../components/OnboardingHeading";
import ProggressBar from "../../components/ProggressBar";
import { t } from "i18next";
import Button from "../../components/Button";
import RadioButton from "../../components/RadioButton";
import { useNavigation } from "@react-navigation/native";
import { postGender } from "../../services/User/send-gender";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const genders = [
  {
    id: 1,
    gender: t("MALE"),
    code: "male",
  },
  {
    id: 2,
    gender: t("FEMALE"),
    code: "female",
  },
  {
    id: 3,
    gender: t("NONBINARY"),
    code: "nonbinary",
  },
];

const GenderScreen = ({ route }) => {
  const [seledtedItem, setSelectedItem] = useState(null);
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

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
    <View
      style={[
        styles.container,
        {
          paddingBottom: insets.bottom,
        },
      ]}
    >
      <View>
        <ProggressBar step={5} totalStep={7}/>
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
    paddingHorizontal: 16
  },
  genders: {
    gap: 16,
  },
  textArea: {
    marginBottom: 24,
  },
});

export default GenderScreen;
