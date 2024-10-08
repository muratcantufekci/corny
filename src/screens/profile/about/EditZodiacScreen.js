import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import useUserStore from "../../../store/useUserStore";
import { t } from "i18next";
import { postUserAbouts } from "../../../services/User/send-user-about";
import RadioButton from "../../../components/RadioButton";

const zodiacData = [
  {
    id: "1",
    name: t("Aries"),
    key: "Aries",
  },
  {
    id: "2",
    name: t("Taurus"),
    key: "Taurus",
  },
  {
    id: "3",
    name: t("Gemini"),
    key: "Gemini",
  },
  {
    id: "4",
    name: t("Cancer"),
    key: "Cancer",
  },
  {
    id: "5",
    name: t("Leo"),
    key: "Leo",
  },
  {
    id: "6",
    name: t("Virgo"),
    key: "Virgo",
  },
  {
    id: "7",
    name: t("Libra"),
    key: "Libra",
  },
  {
    id: "8",
    name: t("Scorpio"),
    key: "Scorpio",
  },
  {
    id: "9",
    name: t("Sagittarius"),
    key: "Sagittarius",
  },
  {
    id: "10",
    name: t("Capricorn"),
    key: "Capricorn",
  },
  {
    id: "11",
    name: t("Aquarius"),
    key: "Aquarius",
  },
  {
    id: "12",
    name: t("Pisces"),
    key: "Pisces",
  },
];

const EditZodiacScreen = () => {
  const userStore = useUserStore();
  const [selectedZodiac, setSelectedZodiac] = useState(
    userStore.userAbouts.find((item) => item.title === "Zodiac")
      ?.values[0]
  );
  const initialZodiac = userStore.userAbouts.find(
    (item) => item.title === "Zodiac"
  )?.values[0];

  useEffect(() => {
    const setZodiac = async () => {
      const data = {
        title: "Zodiac",
        values: [`${selectedZodiac}`],
      };

      const response = await postUserAbouts(data);

      if (response.isSuccess) {
        userStore.setUserAbouts([data]);
      }
    };
    if (initialZodiac !== selectedZodiac) {
      setZodiac();
    }
  }, [selectedZodiac]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.boxes}>
        {zodiacData.map((item) => (
          <RadioButton
            key={item.id}
            code={item.key}
            text={item.name}
            selectedItemIdSetter={setSelectedZodiac}
            selected={item.key === selectedZodiac ? true : false}
          />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 20,
    paddingHorizontal: 16
  },
  boxes: {
    gap: 8,
  },
});

export default EditZodiacScreen;
