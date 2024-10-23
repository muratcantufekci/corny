import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import CustomText from "./CustomText";

const Tabs = ({ tabsData, setTabIndex }) => {
  const [activeTabNumber, setActiveTabNumber] = useState(0);

  const tabPressHandler = (index) => {
    setActiveTabNumber(index);
    setTabIndex && setTabIndex(index);
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} scrollEnabled={tabsData.length > 2 ? true : false}>
        <View style={styles.tabWrapper}>
          {tabsData.map((tab) => (
            <Pressable
              key={tab.name}
              style={[
                styles.tab,
                activeTabNumber === tab.index && styles.activeTab,
              ]}
              onPress={() => tabPressHandler(tab.index)}
            >
              <CustomText style={styles.tabText}>{tab.name}</CustomText>
              {tab.count > 0 && (
                <View style={styles.tabNumber}>
                  <CustomText style={styles.tabNumberText}>
                    {tab.count}
                  </CustomText>
                </View>
              )}
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  tabWrapper: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#00000026",
    marginBottom: 16,
    gap: 10,
    minWidth: "100%",
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingBottom: 12,
    paddingHorizontal: 4,
    alignSelf: "flex-start",
  },
  activeTab: {
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
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
