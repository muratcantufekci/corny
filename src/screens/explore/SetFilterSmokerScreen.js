import React, { useLayoutEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import CustomText from "../../components/CustomText";
import { t } from "i18next";
import AboutBox from "../../components/AboutBox";
import useUserStore from "../../store/useUserStore";

const smokerData = [
    {
      id: "1",
      name: t("Smoker"),
      key: "Smoker",
    },
    {
      id: "2",
      name: t("NonSmoker"),
      key: "NonSmoker",
    },
  ];

const SetFilterSmokerScreen = ({ navigation }) => {
  const userStore = useUserStore()
  const [selectedSmokerHabit, setSelectedSmokerHabit] = useState(userStore?.filters?.Smoker || []);

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
    setSelectedSmokerHabit([]);
    userStore.setFilters("Smoker", []);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.boxes}>
        {smokerData.map((item) => (
          <AboutBox
            key={item.id}
            text={item.name}
            selectedBox={selectedSmokerHabit}
            setSelectedBox={setSelectedSmokerHabit}
            keyName={item.key}
            from="filter"
            filterKey="Smoker"
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

export default SetFilterSmokerScreen;
