import { t } from "i18next";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import AboutBox from "../../../components/AboutBox";
import useUserStore from "../../../store/useUserStore";
import { postUserAbouts } from "../../../services/User/send-user-about";

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

const EditLookingForScreen = () => {
  const userStore = useUserStore();
  const [selectedLookingFors, setSelectedLookingFors] = useState(
    userStore.userAbouts.find((item) => item.title === "LookingFor")?.values
  );
  const initialLookingFors = userStore.userAbouts.find(
    (item) => item.title === "LookingFor"
  )?.values;

  useEffect(() => {
    const setLookingFors = async () => {
      const data = {
        title: "LookingFor",
        values: selectedLookingFors,
      };

      const response = await postUserAbouts(data);

      if (response.isSuccess) {
        userStore.setUserAbouts([data]);
      }
    };
    if (initialLookingFors !== selectedLookingFors) {
      setLookingFors();
    }
  }, [selectedLookingFors]);

  return (
    <View style={styles.container}>
      <View style={styles.boxes}>
        {lookingForData.map((item) => (
          <AboutBox
            key={item.id}
            text={item.name}
            selectedBox={selectedLookingFors}
            setSelectedBox={setSelectedLookingFors}
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

export default EditLookingForScreen;
