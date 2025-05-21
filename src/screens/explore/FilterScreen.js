import React, { useLayoutEffect, useState } from "react";
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import CustomText from "../../components/CustomText";
import { t } from "i18next";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import MenuItem from "../../components/MenuItem";

const CustomMarker = ({ enabled, pressed }) => {
  return (
    <View
      style={{
        height: 18,
        width: 18,
        borderRadius: 12,
        backgroundColor: "#FF524F",
        borderWidth: 2,
        borderColor: "#fff",
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      }}
    />
  );
};

const FilterScreen = ({ navigation }) => {
  const [ageRange, setAgeRange] = useState([18, 70]);
  const [distance, setDistance] = useState(500);

  const menuData = [
    {
      id: "1",
      name: t("INTEREST"),
      screen: "SetFilterInterests",
    },
    {
      id: "2",
      name: t("LOOKINGFOR"),
      screen: "SetFilterLookingFors",
    },
    {
      id: "3",
      name: t("HEIGHT"),
      screen: "EditPhone",
    },
    {
      id: "4",
      name: t("DRINKINGHABIT"),
      screen: "SetFilterDrinkingHabits",
    },
    {
      id: "5",
      name: t("SMOKER"),
      screen: "SetFilterSmokerHabits",
    },
    {
      id: "6",
      name: t("ZODIAC"),
      screen: "SetFilterZodiac",
    },
    {
      id: "7",
      name: t("EDUCATION"),
      screen: "SetFilterEducation",
    },
  ];

  const menuItemPressHandler = (screen) => {
    navigation.navigate(`${screen}`);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable>
          <CustomText>{t("SAVE")}</CustomText>
        </Pressable>
      ),
    });
  }, [navigation]);

  const handleAgeChange = (values) => {
    setAgeRange(values);
  };

  const handleDistanceChange = (values) => {
    setDistance(values[1]);
  };

  return (
    <ScrollView style={styles.container}>
      <CustomText style={styles.sectionTitle}>{`${t("BASIC")} ${t("PREFERENCES")}`}</CustomText>
      <View style={styles.filterSection}>
        <View style={styles.filterRow}>
          <View style={styles.filterRowHead}>
            <CustomText style={styles.label}>{t("AGE")}</CustomText>
            <CustomText style={styles.label}>
              {ageRange[0]}-{ageRange[1]}
            </CustomText>
          </View>
          <View style={styles.sliderWrapper}>
            <MultiSlider
              values={ageRange}
              sliderLength={Dimensions.get("window").width - 64}
              onValuesChange={handleAgeChange}
              min={18}
              max={70}
              step={1}
              allowOverlap={false}
              snapped
              trackStyle={styles.track}
              selectedStyle={styles.selectedTrack}
              customMarker={CustomMarker}
            />
          </View>
        </View>

        <View>
          <View style={styles.filterRowHead}>
            <CustomText style={styles.label}>{t("DISTANCE")}</CustomText>
            <CustomText style={styles.label}>{distance} km</CustomText>
          </View>
          <View style={styles.sliderWrapper}>
            <MultiSlider
              values={[0, distance]}
              sliderLength={Dimensions.get("window").width - 64}
              onValuesChange={handleDistanceChange}
              min={0}
              max={500}
              step={1}
              allowOverlap={false}
              snapped
              trackStyle={styles.track}
              selectedStyle={styles.selectedTrack}
              customMarker={CustomMarker}
              enabledOne={false}
              enabledTwo={true}
            />
          </View>
        </View>
      </View>
      <CustomText style={styles.sectionTitle}>{`${t("PREMIUM")} ${t("PREFERENCES")}`}</CustomText>
      <View style={styles.menuItems}>
        {menuData.map((item) => (
          <MenuItem
            key={item.id}
            name={item.name}
            onPress={() => menuItemPressHandler(item.screen)}
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
  sectionTitle: {
    fontWeight: "600",
    fontSize: 20,
    lineHeight: 32,
    marginBottom: 16,
  },
  filterSection: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D1D1D6",
    marginBottom: 32,
  },
  filterRow: {
    borderBottomWidth: 1,
    borderColor: "#D1D1D6",
  },
  filterRowHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  label: {
    fontWeight: "400",
    fontSize: 14,
    lineHeight: 20,
    color: "#000000",
  },
  sliderWrapper: {
    alignItems: "center",
  },
  track: {
    height: 3,
    backgroundColor: "#E4E4E7",
    borderRadius: 2,
  },
  selectedTrack: {
    backgroundColor: "#FF524F",
  },
  menuItems: {
    marginBottom: 32
  }
});

export default FilterScreen;
