import React, { useLayoutEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import CustomText from "../../components/CustomText";
import { t } from "i18next";
import AboutBox from "../../components/AboutBox";
import useUserStore from "../../store/useUserStore";

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

const SetFilterZodiacScreen = ({ navigation }) => {
  const userStore = useUserStore();
  const [selectedZodiac, setSelectedZodiac] = useState(
    userStore?.filters?.Zodiac || []
  );
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={resetBtnPressHandler}>
          <CustomText>{t("RESET")}</CustomText>
        </Pressable>
      ),
    });
  }, [navigation]);

  const resetBtnPressHandler = () => {
    setSelectedZodiac([]);
    userStore.setFilters("Zodiac", []);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.boxes}>
        {zodiacData.map((item) => (
          <AboutBox
            key={item.id}
            text={item.name}
            selectedBox={selectedZodiac}
            setSelectedBox={setSelectedZodiac}
            keyName={item.key}
            from="filter"
            filterKey="Zodiac"
          />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 32,
  },
  boxes: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    flexWrap: "wrap",
    marginBottom: 48,
  },
});

export default SetFilterZodiacScreen;
