import React, { useLayoutEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import CustomText from "../../components/CustomText";
import { t } from "i18next";
import AboutBox from "../../components/AboutBox";

const drinkingHabitData = [
  {
    id: "1",
    name: t("Never"),
    key: "Never",
  },
  {
    id: "2",
    name: t("Rarely"),
    key: "Rarely",
  },
  {
    id: "3",
    name: t("SocialDrinker"),
    key: "SocialDrinker",
  },
  {
    id: "4",
    name: t("RegularDrinker"),
    key: "RegularDrinker",
  },
  {
    id: "5",
    name: t("HeavyDrinker"),
    key: "HeavyDrinker",
  },
  {
    id: "6",
    name: t("Occasionally"),
    key: "Occasionally",
  },
];

const SetFilterDrinkingHabitScreen = ({ navigation }) => {
  const [selectedDrinkingHabit, setSelectedDrinkingHabit] = useState([]);
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
    setSelectedDrinkingHabit([]);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.boxes}>
        {drinkingHabitData.map((item) => (
          <AboutBox
            key={item.id}
            text={item.name}
            selectedBox={selectedDrinkingHabit}
            setSelectedBox={setSelectedDrinkingHabit}
            keyName={item.key}
            from="filter"
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

export default SetFilterDrinkingHabitScreen;
