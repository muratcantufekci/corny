import React from "react";
import { StyleSheet, View } from "react-native";
import CustomText from "./CustomText";

const Tabs = ({tabText, tabCount}) => {
  return (
    <View style={styles.tabWrapper}>
      <View style={styles.tab}>
        <CustomText style={styles.tabText}>{tabText}</CustomText>
        {tabCount && tabCount > 0 && (
          <View style={styles.tabNumber}>
            <CustomText style={styles.tabNumberText}>
              {tabCount}
            </CustomText>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tabWrapper: {
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#00000026",
    marginBottom: 16,
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingBottom: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    alignSelf: "flex-start",
  },
  tabText: {
    fontWeight: "500",
    fontSize: 16,
    lineHeight: 24,
    color: "#000000",
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

export default Tabs;
