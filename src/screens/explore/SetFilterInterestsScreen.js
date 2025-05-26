import React, { useLayoutEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import CustomText from "../../components/CustomText";
import { t } from "i18next";
import AboutBox from "../../components/AboutBox";
import useUserStore from "../../store/useUserStore";

const interestData = [
  {
    id: "1",
    name: t("Music"),
    key: "Music",
  },
  {
    id: "2",
    name: t("Swimming"),
    key: "Swimming",
  },
  {
    id: "3",
    name: t("Football"),
    key: "Football",
  },
  {
    id: "4",
    name: t("Beaches"),
    key: "Beaches",
  },
  {
    id: "5",
    name: t("Movies"),
    key: "Movies",
  },
  {
    id: "6",
    name: t("Travelling"),
    key: "Travelling",
  },
  {
    id: "7",
    name: t("Reading"),
    key: "Reading",
  },
  {
    id: "8",
    name: t("Cooking"),
    key: "Cooking",
  },
  {
    id: "9",
    name: t("Hiking"),
    key: "Hiking",
  },
  {
    id: "10",
    name: t("Photography"),
    key: "Photography",
  },
  {
    id: "11",
    name: t("Yoga"),
    key: "Yoga",
  },
  {
    id: "12",
    name: t("Gaming"),
    key: "Gaming",
  },
  {
    id: "13",
    name: t("Art"),
    key: "Art",
  },
  {
    id: "14",
    name: t("Fitness"),
    key: "Fitness",
  },
  {
    id: "15",
    name: t("Dancing"),
    key: "Dancing",
  },
  {
    id: "16",
    name: t("Gardening"),
    key: "Gardening",
  },
  {
    id: "17",
    name: t("Running"),
    key: "Running",
  },
  {
    id: "18",
    name: t("Cycling"),
    key: "Cycling",
  },
  {
    id: "19",
    name: t("Tennis"),
    key: "Tennis",
  },
  {
    id: "20",
    name: t("Basketball"),
    key: "Basketball",
  },
  {
    id: "21",
    name: t("Painting"),
    key: "Painting",
  },
  {
    id: "22",
    name: t("Writing"),
    key: "Writing",
  },
  {
    id: "23",
    name: t("Skiing"),
    key: "Skiing",
  },
  {
    id: "24",
    name: t("Surfing"),
    key: "Surfing",
  },
  {
    id: "25",
    name: t("Fashion"),
    key: "Fashion",
  },
  {
    id: "26",
    name: t("Technology"),
    key: "Technology",
  },
  {
    id: "27",
    name: t("Science"),
    key: "Science",
  },
  {
    id: "28",
    name: t("Animals"),
    key: "Animals",
  },
  {
    id: "29",
    name: t("Theater"),
    key: "Theater",
  },
  {
    id: "30",
    name: t("WineTasting"),
    key: "WineTasting",
  },
  {
    id: "31",
    name: t("Volunteering"),
    key: "Volunteering",
  },
  {
    id: "32",
    name: t("Meditation"),
    key: "Meditation",
  },
  {
    id: "33",
    name: t("MartialArts"),
    key: "MartialArts",
  },
  {
    id: "34",
    name: t("Camping"),
    key: "Camping",
  },
  {
    id: "35",
    name: t("History"),
    key: "History",
  },
  {
    id: "36",
    name: t("Languages"),
    key: "Languages",
  },
  {
    id: "37",
    name: t("Museums"),
    key: "Museums",
  },
  {
    id: "38",
    name: t("Concerts"),
    key: "Concerts",
  },
  {
    id: "39",
    name: t("Festivals"),
    key: "Festivals",
  },
  {
    id: "40",
    name: t("Socializing"),
    key: "Socializing",
  },
  {
    id: "41",
    name: t("Spirituality"),
    key: "Spirituality",
  },
  {
    id: "42",
    name: t("NatureWalks"),
    key: "NatureWalks",
  },
  {
    id: "43",
    name: t("SelfImprovement"),
    key: "SelfImprovement",
  },
  {
    id: "44",
    name: t("RoadTrips"),
    key: "RoadTrips",
  },
  {
    id: "45",
    name: t("Karaoke"),
    key: "Karaoke",
  },
  {
    id: "46",
    name: t("Entrepreneurship"),
    key: "Entrepreneurship",
  },
  {
    id: "47",
    name: t("Golf"),
    key: "Golf",
  },
];

const SetFilterInterestsScreen = ({ navigation }) => {
  const userStore = useUserStore()
  const [selectedInterest, setSelectedInterest] = useState(userStore?.filters?.Interests || []);
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
    setSelectedInterest([])
    userStore.setFilters("Interests", []);
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.boxes}>
        {interestData.map((item) => (
          <AboutBox
            key={item.id}
            text={item.name}
            selectedBox={selectedInterest}
            setSelectedBox={setSelectedInterest}
            keyName={item.key}
            from="filter"
            filterKey="Interests"
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
    marginBottom: 48
  },
});

export default SetFilterInterestsScreen;
