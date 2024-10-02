import React from "react";
import { Pressable, StyleSheet } from "react-native";
import CustomText from "./CustomText";
import * as Haptics from "expo-haptics";

const AboutBox = ({
  text,
  selectedBox,
  setSelectedBox,
  keyName,
  disabled = false,
}) => {
  const isSelected = selectedBox.includes(keyName);
  const handlePress = () => {
    if (isSelected) {
      if (selectedBox.length > 1) {
        setSelectedBox(selectedBox.filter((item) => item !== keyName));
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      }
    } else {
      setSelectedBox([...selectedBox, keyName]);
    }
  };

  return (
    <Pressable
      style={[styles.container, isSelected && styles.selected]}
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
