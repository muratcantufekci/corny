import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import useUserStore from "../../../store/useUserStore";
import { t } from "i18next";
import { postUserAbouts } from "../../../services/User/send-user-about";
import RadioButton from "../../../components/RadioButton";

const educationData = [
  {
    id: "1",
    name: t("HighSchool"),
    key: "HighSchool",
  },
  {
    id: "2",
    name: t("BachelorsDegree"),
    key: "BachelorsDegree",
  },
  {
    id: "3",
    name: t("MastersDegree"),
    key: "MastersDegree",
  },
  {
    id: "4",
    name: t("Doctorate"),
    key: "Doctorate",
  },
  {
    id: "5",
    name: t("ProfessionalDegree"),
    key: "ProfessionalDegree",
  },
  {
    id: "6",
    name: t("NoFormalEducation"),
    key: "NoFormalEducation",
  },
];

const EditEducationScreen = () => {
  const userStore = useUserStore();
  const [selectedEducation, setSelectedEducation] = useState(
    userStore.userAbouts.find((item) => item.title === "Education")?.values[0]
  );
  const initialEducations = userStore.userAbouts.find(
    (item) => item.title === "Education"
  )?.values[0];

  useEffect(() => {
    const setEducations = async () => {
      const data = {
        title: "Education",
        values: [`${selectedEducation}`],
      };

      const response = await postUserAbouts(data);

      if (response.isSuccess) {
        userStore.setUserAbouts([data]);
      }
    };
    if (initialEducations !== selectedEducation) {
      setEducations();
    }
  }, [selectedEducation]);

  return (
    <View style={styles.container}>
      <View style={styles.boxes}>
        {educationData.map((item) => (
          <RadioButton
            key={item.id}
            code={item.key}
            text={item.name}
            selectedItemIdSetter={setSelectedEducation}
            selected={item.key === selectedEducation ? true : false}
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

export default EditEducationScreen;
