import React, { useLayoutEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import CustomText from "../../components/CustomText";
import { t } from "i18next";
import AboutBox from "../../components/AboutBox";
import useUserStore from "../../store/useUserStore";

const lookingForData = [
  {
    id: "1",
    name: t("Relationship"),
    key: "Relationship",
  },
  {
    id: "2",
    name: t("OneNightStand"),
    key: "OneNightStand",
  },
  {
    id: "3",
    name: t("CasualDating"),
    key: "CasualDating",
  },
  {
    id: "4",
    name: t("Friendship"),
    key: "Friendship",
  },
  {
    id: "5",
    name: t("AdventurePartner"),
    key: "AdventurePartner",
  },
  {
    id: "6",
    name: t("ActivityPartner"),
    key: "ActivityPartner",
  },
  {
    id: "7",
    name: t("TravelBuddy"),
    key: "TravelBuddy",
  },
];

const SetFilterLookingForsScreen = ({ navigation }) => {
  const userStore = useUserStore();
  const [selectedLookingFor, setSelectedLookingFor] = useState(
    userStore?.filters?.LookingFor || []
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
    setSelectedLookingFor([]);
    userStore.setFilters("LookingFor", []);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.boxes}>
        {lookingForData.map((item) => (
          <AboutBox
            key={item.id}
            text={item.name}
            selectedBox={selectedLookingFor}
            setSelectedBox={setSelectedLookingFor}
            keyName={item.key}
            from="filter"
            filterKey="LookingFor"
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

export default SetFilterLookingForsScreen;
