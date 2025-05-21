import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import CustomText from "./CustomText";
import Arrow from "../assets/svg/arrow-left.svg";

const MenuItem = ({ name, onPress }) => {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <CustomText style={styles.menuItemText}>{name}</CustomText>
      <Arrow style={styles.icon} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#E4E4E7",
  },
  menuItemText: {
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 24,
    color: "#000000",
  },
  icon: {
    transform: [{ rotate: "180deg" }],
  },
});

export default MenuItem;
