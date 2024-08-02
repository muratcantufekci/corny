import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import OnboardingHeading from "../../components/OnboardingHeading";
import ProggressBar from "../../components/ProggressBar";
import { t } from "i18next";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Localization from "expo-localization";
import Button from "../../components/Button";
import { useNavigation } from "@react-navigation/native";

const BirthdayScreen = () => {
  const [date, setDate] = useState(new Date());
  const navigation = useNavigation();

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
  };

  const nextBtnPressHandler = () => {
    navigation.navigate("Mail");
  }

  return (
    <View style={styles.container}>
      <View>
        <ProggressBar step={6} />
        <OnboardingHeading title={t("BIRTHDAY_SCREEN_TITLE")} style={styles.textArea}/>
        <View style={styles.dateWrapper}>
          <DateTimePicker
            value={date}
            mode="date"
            onChange={onChange}
            display="spinner"
            locale={Localization.locale}
            maximumDate={new Date()}
          />
        </View>
      </View>
        <Button variant="primary" onPress={nextBtnPressHandler}>{t("NEXT")}</Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  textArea: {
    marginBottom: 24,
  },
  dateWrapper: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D1D1D6",
  },
});

export default BirthdayScreen;
