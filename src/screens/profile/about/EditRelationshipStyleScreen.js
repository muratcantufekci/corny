import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import useUserStore from "../../../store/useUserStore";
import { t } from "i18next";
import { postUserAbouts } from "../../../services/User/send-user-about";
import AboutBox from "../../../components/AboutBox";

const relationshipStyleData = [
  {
    id: "1",
    name: t("Monogamous"),
    key: "Monogamous",
  },
  {
    id: "2",
    name: t("OpenRelationship"),
    key: "OpenRelationship",
  },
  {
    id: "3",
    name: t("Polyamorous"),
    key: "Polyamorous",
  },
  {
    id: "4",
    name: t("RelationshipAnarchy"),
    key: "RelationshipAnarchy",
  },
  {
    id: "5",
    name: t("Other"),
    key: "Other",
  },
];

const EditRelationshipStyleScreen = () => {
  const userStore = useUserStore();
  const [selectedRelationshipStyle, setSelectedRelationshipStyle] = useState(
    userStore.userAbouts.find((item) => item.title === "RelationshipStyle")?.values
  );
  const initialRelationshipStyle = userStore.userAbouts.find(
    (item) => item.title === "RelationshipStyle"
  )?.values;

  useEffect(() => {
    const setRelationshipStyle = async () => {
      const data = {
        title: "RelationshipStyle",
        values: selectedRelationshipStyle,
      };

      const response = await postUserAbouts(data);

      if (response.isSuccess) {
        userStore.setUserAbouts([data]);
      }
    };
    if (initialRelationshipStyle !== selectedRelationshipStyle) {
      setRelationshipStyle();
    }
  }, [selectedRelationshipStyle]);

  return (
    <View style={styles.container}>
      <View style={styles.boxes}>
        {relationshipStyleData.map((item) => (
          <AboutBox
            key={item.id}
            text={item.name}
            selectedBox={selectedRelationshipStyle}
            setSelectedBox={setSelectedRelationshipStyle}
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

export default EditRelationshipStyleScreen;
