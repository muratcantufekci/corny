import { t } from "i18next";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import useUserStore from "../../../store/useUserStore";
import { postUserAbouts } from "../../../services/User/send-user-about";
import RadioButton from "../../../components/RadioButton";

const exerciseHabitData = [
    {
      id: "1",
      name: t("Always"),
      key: "Always",
    },
    {
      id: "2",
      name: t("Often"),
      key: "Often",
    },
    {
      id: "3",
      name: t("Sometimes"),
      key: "Sometimes",
    },
    {
      id: "4",
      name: t("Rarely"),
      key: "Rarely",
    },
    {
      id: "5",
      name: t("Never"),
      key: "Never",
    },
  ];

const EditExerciseHabitScreen = () => {
  const userStore = useUserStore();
  const [selectedExerciseHabit, setSelectedExerciseHabit] = useState(
    userStore.userAbouts.find((item) => item.title === "ExerciseHabit")?.values[0]
  );
  const initialExerciseHabit = userStore.userAbouts.find(
    (item) => item.title === "ExerciseHabit"
  )?.values[0];

  useEffect(() => {
    const setExerciseHabit = async () => {
      const data = {
        title: "ExerciseHabit",
        values: [`${selectedExerciseHabit}`],
      };

      const response = await postUserAbouts(data);

      if (response.isSuccess) {
        userStore.setUserAbouts([data]);
      }
    };
    if (initialExerciseHabit !== selectedExerciseHabit) {
      setExerciseHabit();
    }
  }, [selectedExerciseHabit]);

  return (
    <View style={styles.container}>
      <View style={styles.boxes}>
        {exerciseHabitData.map((item) => (
          <RadioButton
            key={item.id}
            code={item.key}
            text={item.name}
            selectedItemIdSetter={setSelectedExerciseHabit}
            selected={item.key === selectedExerciseHabit ? true : false}
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
    gap: 8,
  },
});

export default EditExerciseHabitScreen;
