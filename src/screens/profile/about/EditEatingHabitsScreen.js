import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import useUserStore from "../../../store/useUserStore";
import { postUserAbouts } from "../../../services/User/send-user-about";
import AboutBox from "../../../components/AboutBox";
import { t } from "i18next";

const eatingHabitsData = [
  {
    id: "1",
    name: t("Everything"),
    key: "Everything",
  },
  {
    id: "2",
    name: t("Vegetarian"),
    key: "Vegetarian",
  },
  {
    id: "3",
    name: t("Vegan"),
    key: "Vegan",
  },
  {
    id: "4",
    name: t("Pescatarian"),
    key: "Pescatarian",
  },
  {
    id: "5",
    name: t("Flexitarian"),
    key: "Flexitarian",
  },
  {
    id: "6",
    name: t("Paleo"),
    key: "Paleo",
  },
  {
    id: "7",
    name: t("Keto"),
    key: "Keto",
  },
  {
    id: "8",
    name: t("GlutenFree"),
    key: "GlutenFree",
  },
  {
    id: "9",
    name: t("LactoseFree"),
    key: "LactoseFree",
  },
  {
    id: "10",
    name: t("LowCarb"),
    key: "LowCarb",
  },
  {
    id: "11",
    name: t("Organic"),
    key: "Organic",
  },
  {
    id: "12",
    name: t("Carnivore"),
    key: "Carnivore",
  },
  {
    id: "13",
    name: t("RawFood"),
    key: "RawFood",
  },
  {
    id: "14",
    name: t("Halal"),
    key: "Halal",
  },
  {
    id: "15",
    name: t("Kosher"),
    key: "Kosher",
  },
  {
    id: "16",
    name: t("NoRedMeat"),
    key: "NoRedMeat",
  },
  {
    id: "17",
    name: t("IntermittentFasting"),
    key: "IntermittentFasting",
  },
];

const EditEatingHabitsScreen = () => {
  const userStore = useUserStore();
  const [selectedEatingHabits, setSelectedEatingHabits] = useState(
    userStore.userAbouts.find((item) => item.title === "EatingHabit")?.values
  );
  const initialEatingHabits = userStore.userAbouts.find(
    (item) => item.title === "EatingHabit"
  )?.values;

  useEffect(() => {
    const setEatingHabits = async () => {
      const data = {
        title: "EatingHabit",
        values: selectedEatingHabits,
      };

      const response = await postUserAbouts(data);

      if (response.isSuccess) {
        userStore.setUserAbouts([data]);
      }
    };
    if (initialEatingHabits !== selectedEatingHabits) {
      setEatingHabits();
    }
  }, [selectedEatingHabits]);

  return (
    <View style={styles.container}>
      <View style={styles.boxes}>
        {eatingHabitsData.map((item) => (
          <AboutBox
            key={item.id}
            text={item.name}
            selectedBox={selectedEatingHabits}
            setSelectedBox={setSelectedEatingHabits}
            keyName={item.key}
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
    paddingHorizontal: 16
  },
  boxes: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    flexWrap: "wrap",
  },
});

export default EditEatingHabitsScreen;
