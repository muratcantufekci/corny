import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import useUserStore from "../../../store/useUserStore";
import { postUserAbouts } from "../../../services/User/send-user-about";
import RadioButton from "../../../components/RadioButton";
import { t } from "i18next";

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

const EditSmokerScreen = () => {
  const userStore = useUserStore();
  const [selectedSmoker, setSelectedSmoker] = useState(
    userStore.userAbouts.find((item) => item.title === "Smoker")?.values[0]
  );
  const initialSmoker = userStore.userAbouts.find(
    (item) => item.title === "Smoker"
  )?.values[0];

  useEffect(() => {
    const setSmoker = async () => {
      const data = {
        title: "Smoker",
        values: [`${selectedSmoker}`],
      };

      const response = await postUserAbouts(data);

      if (response.isSuccess) {
        userStore.setUserAbouts([data]);
      }
    };
    if (initialSmoker !== selectedSmoker) {
      setSmoker();
    }
  }, [selectedSmoker]);

  return (
    <View style={styles.container}>
      <View style={styles.boxes}>
        {smokerData.map((item) => (
          <RadioButton
            key={item.id}
            code={item.key}
            text={item.name}
            selectedItemIdSetter={setSelectedSmoker}
            selected={item.key === selectedSmoker ? true : false}
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

export default EditSmokerScreen;
