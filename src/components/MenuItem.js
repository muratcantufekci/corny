import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import CustomText from "./CustomText";
import Arrow from "../assets/svg/arrow-left.svg";

const MenuItem = ({ name, onPress, selectedCount }) => {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View>
        <CustomText style={styles.menuItemText}>{name}</CustomText>
      </View>
      <View style={styles.menuItemRight}>
        {selectedCount && (
          <View style={styles.tabNumber}>
            <CustomText style={styles.tabNumberText}>
              {selectedCount}
            </CustomText>
          </View>
        )}
        <Arrow style={styles.icon} />
      </View>
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
  menuItemRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
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
  tabNumber: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
    backgroundColor: "#FF524F",
  },
  tabNumberText: {
    fontWeight: "500",
    fontSize: 12,
    lineHeight: 16,
    color: "#000000",
  },
});

export default MenuItem;
