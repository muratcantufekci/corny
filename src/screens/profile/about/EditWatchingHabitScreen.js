import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import useUserStore from "../../../store/useUserStore";
import { postUserAbouts } from "../../../services/User/send-user-about";
import RadioButton from "../../../components/RadioButton";
import { t } from "i18next";

const watchingHabitData = [
  {
    id: "1",
    name: t("Addicted"),
    key: "Addicted",
  },
  {
    id: "2",
    name: t("Everyday"),
    key: "Everyday",
  },
  {
    id: "3",
    name: t("FewTimesAWeek"),
    key: "FewTimesAWeek",
  },
  {
    id: "4",
    name: t("OnceAWeek"),
    key: "OnceAWeek",
  },
  {
    id: "5",
    name: t("Rarely"),
    key: "Rarely",
  },
];

const EditWatchingHabitScreen = () => {
  const userStore = useUserStore();
  const [selectedWatchingHabit, setSelectedWatchingHabit] = useState(
    userStore.userAbouts.find((item) => item.title === "WatchingHabit")
      ?.values[0]
  );
  const initialWatchingHabit = userStore.userAbouts.find(
    (item) => item.title === "WatchingHabit"
  )?.values[0];

  useEffect(() => {
    const setWatchingHabit = async () => {
      const data = {
        title: "WatchingHabit",
        values: [`${selectedWatchingHabit}`],
      };

      const response = await postUserAbouts(data);

      if (response.isSuccess) {
        userStore.setUserAbouts([data]);
      }
    };
    if (initialWatchingHabit !== selectedWatchingHabit) {
      setWatchingHabit();
    }
  }, [selectedWatchingHabit]);

  return (
    <View style={styles.container}>
      <View style={styles.boxes}>
        {watchingHabitData.map((item) => (
          <RadioButton
            key={item.id}
            code={item.key}
            text={item.name}
            selectedItemIdSetter={setSelectedWatchingHabit}
            selected={item.key === selectedWatchingHabit ? true : false}
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

export default EditWatchingHabitScreen;
