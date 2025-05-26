import React from "react";
import { Pressable, StyleSheet } from "react-native";
import CustomText from "./CustomText";
import * as Haptics from "expo-haptics";
import useUserStore from "../store/useUserStore";

const AboutBox = ({
  text,
  selectedBox,
  setSelectedBox,
  keyName,
  disabled = false,
  from = "",
  filterKey = "",
}) => {
  const isSelected = selectedBox?.includes(keyName);
  const userStore = useUserStore();

  const handlePress = () => {
    const isFilterMode = from === "filter";

    if (isSelected) {
      if (isFilterMode) {
        userStore.setFilters(filterKey, keyName);
      } else if (selectedBox?.length <= 1) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        return;
      }

      setSelectedBox(selectedBox?.filter((item) => item !== keyName));
      return;
    }

    if (isFilterMode) {
      userStore.setFilters(filterKey, keyName);
    }

    setSelectedBox([...selectedBox, keyName]);
  };

  return (
    <Pressable
      style={[
        styles.container,
        isSelected &&
          (from === "filter" ? styles.selectedFilter : styles.selected),
      ]}
      disabled={disabled}
      onPress={handlePress}
    >
      <CustomText style={[styles.text, isSelected && styles.selectedText]}>
        {text}
      </CustomText>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#EFEFF1",
    borderRadius: 12,
  },
  selected: {
    backgroundColor: "#FFB4B2",
  },
  selectedFilter: {
    backgroundColor: "#FF524F",
  },
  text: {
    fontWeight: "500",
    fontSize: 16,
    lineHeight: 24,
    color: "#737482",
  },
  selectedText: {
    color: "#000000",
  },
});

export default AboutBox;
