import { t } from "i18next";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import useUserStore from "../../../store/useUserStore";
import { postUserAbouts } from "../../../services/User/send-user-about";
import RadioButton from "../../../components/RadioButton";

const politicalViewData = [
  {
    id: "1",
    name: t("Political"),
    key: "Political",
  },
  {
    id: "2",
    name: t("NonPolitical"),
    key: "NonPolitical",
  },
];

const EditPoliticalViewScreen = () => {
  const userStore = useUserStore();
  const [selectedPoliticalView, setSelectedPoliticalView] = useState(
    userStore.userAbouts.find((item) => item.title === "PoliticalView")?.values[0]
  );
  const initialPoliticalView = userStore.userAbouts.find(
    (item) => item.title === "PoliticalView"
  )?.values[0];

  useEffect(() => {
    const setPoliticalView = async () => {
      const data = {
        title: "PoliticalView",
        values: [`${selectedPoliticalView}`],
      };

      const response = await postUserAbouts(data);

      if (response.isSuccess) {
        userStore.setUserAbouts([data]);
      }
    };
    if (initialPoliticalView !== selectedPoliticalView) {
      setPoliticalView();
    }
  }, [selectedPoliticalView]);

  return (
    <View style={styles.container}>
      <View style={styles.boxes}>
        {politicalViewData.map((item) => (
          <RadioButton
            key={item.id}
            code={item.key}
            text={item.name}
            selectedItemIdSetter={setSelectedPoliticalView}
            selected={item.key === selectedPoliticalView ? true : false}
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
  },
  boxes: {
    gap: 8,
  },
});

export default EditPoliticalViewScreen;
