import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import useUserStore from "../../../store/useUserStore";
import { postUserAbouts } from "../../../services/User/send-user-about";
import { t } from "i18next";
import AboutBox from "../../../components/AboutBox";

const religiousViewData = [
  {
    id: "1",
    name: t("NonReligious"),
    key: "NonReligious",
  },
  {
    id: "2",
    name: t("Religious"),
    key: "Religious",
  },
  {
    id: "3",
    name: t("Spiritual"),
    key: "Spiritual",
  },
  {
    id: "4",
    name: t("Agnostic"),
    key: "Agnostic",
  },
  {
    id: "5",
    name: t("Atheist"),
    key: "Atheist",
  },
  {
    id: "6",
    name: t("Undecided"),
    key: "Undecided",
  },
];

const EditReligiousViewScreen = () => {
  const userStore = useUserStore();
  const [selectedReligiousView, setSelectedReligiousView] = useState(
    userStore.userAbouts.find((item) => item.title === "ReligiousView")?.values
  );
  const initialReligiousView = userStore.userAbouts.find(
    (item) => item.title === "ReligiousView"
  )?.values;

  useEffect(() => {
    const setReligiousView = async () => {
      const data = {
        title: "ReligiousView",
        values: selectedReligiousView,
      };

      const response = await postUserAbouts(data);

      if (response.isSuccess) {
        userStore.setUserAbouts([data]);
      }
    };
    if (initialReligiousView !== selectedReligiousView) {
        setReligiousView();
    }
  }, [selectedReligiousView]);

  return (
    <View style={styles.container}>
      <View style={styles.boxes}>
        {religiousViewData.map((item) => (
          <AboutBox
            key={item.id}
            text={item.name}
            selectedBox={selectedReligiousView}
            setSelectedBox={setSelectedReligiousView}
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
  },
  boxes: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    flexWrap: "wrap",
  },
});

export default EditReligiousViewScreen;
