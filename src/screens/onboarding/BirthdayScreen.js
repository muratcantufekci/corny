import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import OnboardingHeading from "../../components/OnboardingHeading";
import ProggressBar from "../../components/ProggressBar";
import { t } from "i18next";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Localization from "expo-localization";
import Button from "../../components/Button";
import { useNavigation } from "@react-navigation/native";
import { postBirthday } from "../../services/User/send-birthday";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const BirthdayScreen = ({ route }) => {
  const [date, setDate] = useState(new Date());
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (route.params?.disableBack) {
      navigation.setOptions({
        headerLeft: () => null,
      });
    }
  }, [navigation, route.params?.disableBack]);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;

    setDate(currentDate);
  };

  const nextBtnPressHandler = async () => {
    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1;
    const year = date.getUTCFullYear();

    const response = await postBirthday(day, month, year);

    if (response.isSuccess) {
      navigation.navigate("Mail");
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
        <ProggressBar step={6} />
        <OnboardingHeading
          title={t("BIRTHDAY_SCREEN_TITLE")}
          style={styles.textArea}
        />
        <View style={styles.dateWrapper}>
          <DateTimePicker
            value={date}
            mode="date"
            onChange={onChange}
            display="spinner"
            locale={Localization.locale}
            maximumDate={
              new Date(new Date().setFullYear(new Date().getFullYear() - 18))
            }
            timeZoneName="UTC"
          />
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
