import React, { useLayoutEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import CustomText from "../../components/CustomText";
import { t } from "i18next";
import AboutBox from "../../components/AboutBox";
import useUserStore from "../../store/useUserStore";

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

const SetFilterEducationScreen = ({ navigation }) => {
  const userStore = useUserStore();
  const [selectedEducation, setSelectedEducation] = useState(
    userStore?.filters?.Education || []
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
    setSelectedEducation([]);
    userStore.setFilters("Education", []);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.boxes}>
        {educationData.map((item) => (
          <AboutBox
            key={item.id}
            text={item.name}
            selectedBox={selectedEducation}
            setSelectedBox={setSelectedEducation}
            keyName={item.key}
            from="filter"
            filterKey="Education"
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

export default SetFilterEducationScreen;
