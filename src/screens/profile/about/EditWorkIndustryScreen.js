import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import AboutBox from "../../../components/AboutBox";
import { t } from "i18next";
import { useEffect } from "react";
import { postUserAbouts } from "../../../services/User/send-user-about";
import useUserStore from "../../../store/useUserStore";

const workIndustryData = [
  {
    id: "1",
    name: t("ITTechnology"),
    key: "ITTechnology",
  },
  {
    id: "2",
    name: t("Health"),
    key: "Health",
  },
  {
    id: "3",
    name: t("Insurance"),
    key: "Insurance",
  },
  {
    id: "4",
    name: t("Banking"),
    key: "Banking",
  },
  {
    id: "5",
    name: t("Finance"),
    key: "Finance",
  },
  {
    id: "6",
    name: t("Education"),
    key: "Education",
  },
  {
    id: "7",
    name: t("Manufacturing"),
    key: "Manufacturing",
  },
  {
    id: "8",
    name: t("Construction"),
    key: "Construction",
  },
  {
    id: "9",
    name: t("Retail"),
    key: "Retail",
  },
  {
    id: "10",
    name: t("TransportationLogistics"),
    key: "TransportationLogistics",
  },
  {
    id: "11",
    name: t("Telecommunications"),
    key: "Telecommunications",
  },
  {
    id: "12",
    name: t("Energy"),
    key: "Energy",
  },
  {
    id: "13",
    name: t("Legal"),
    key: "Legal",
  },
  {
    id: "14",
    name: t("RealEstate"),
    key: "RealEstate",
  },
  {
    id: "15",
    name: t("HospitalityTourism"),
    key: "HospitalityTourism",
  },
  {
    id: "16",
    name: t("EntertainmentMedia"),
    key: "EntertainmentMedia",
  },
  {
    id: "17",
    name: t("Agriculture"),
    key: "Agriculture",
  },
  {
    id: "18",
    name: t("GovernmentPublicAdministration"),
    key: "GovernmentPublicAdministration",
  },
  {
    id: "19",
    name: t("NonprofitSocialServices"),
    key: "NonprofitSocialServices",
  },
  {
    id: "20",
    name: t("AerospaceDefense"),
    key: "AerospaceDefense",
  },
  {
    id: "21",
    name: t("Pharmaceuticals"),
    key: "Pharmaceuticals",
  },
  {
    id: "22",
    name: t("EnvironmentalServices"),
    key: "EnvironmentalServices",
  },
  {
    id: "23",
    name: t("HumanResources"),
    key: "HumanResources",
  },
  {
    id: "24",
    name: t("Consulting"),
    key: "Consulting",
  },
  {
    id: "25",
    name: t("MarketingAdvertising"),
    key: "MarketingAdvertising",
  },
  {
    id: "26",
    name: t("Fashion"),
    key: "Fashion",
  },
  {
    id: "27",
    name: t("Automotive"),
    key: "Automotive",
  },
  {
    id: "28",
    name: t("FoodBeverage"),
    key: "FoodBeverage",
  },
  {
    id: "29",
    name: t("ArtDesign"),
    key: "ArtDesign",
  },
  {
    id: "30",
    name: t("EventPlanning"),
    key: "EventPlanning",
  },
  {
    id: "31",
    name: t("SportsRecreation"),
    key: "SportsRecreation",
  },
  {
    id: "32",
    name: t("Publishing"),
    key: "Publishing",
  },
  {
    id: "33",
    name: t("ResearchDevelopment"),
    key: "ResearchDevelopment",
  },
  {
    id: "34",
    name: t("Biotechnology"),
    key: "Biotechnology",
  },
  {
    id: "35",
    name: t("ConsumerGoods"),
    key: "ConsumerGoods",
  },
  {
    id: "36",
    name: t("SupplyChainManagement"),
    key: "SupplyChainManagement",
  },
  {
    id: "37",
    name: t("Security"),
    key: "Security",
  },
  {
    id: "38",
    name: t("Chemicals"),
    key: "Chemicals",
  },
  {
    id: "39",
    name: t("MiningMetals"),
    key: "MiningMetals",
  },
  {
    id: "40",
    name: t("ArchitectureUrbanPlanning"),
    key: "ArchitectureUrbanPlanning",
  },
  {
    id: "41",
    name: t("Forestry"),
    key: "Forestry",
  },
];

const EditWorkIndustryScreen = () => {
  const userStore = useUserStore();
  const [selectedWorkIndustries, setSelectedWorkIndustries] = useState(
    userStore.userAbouts.find((item) => item.title === "WorkIndustry")?.values
  );
  const initialWorkIndustries = userStore.userAbouts.find(
    (item) => item.title === "WorkIndustry"
  )?.values;

  useEffect(() => {
    const setWorkIndustries = async () => {
      const data = {
        title: "WorkIndustry",
        values: selectedWorkIndustries,
      };

      const response = await postUserAbouts(data);
      if (response.isSuccess) {
        userStore.setUserAbouts([data]);
      }
    };
    if (initialWorkIndustries !== selectedWorkIndustries) {
      setWorkIndustries();
    }
  }, [selectedWorkIndustries]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.boxes}>
        {workIndustryData.map((item) => (
          <AboutBox
            key={item.id}
            text={item.name}
            selectedBox={selectedWorkIndustries}
            setSelectedBox={setSelectedWorkIndustries}
            keyName={item.key}
          />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  boxes: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    flexWrap: "wrap",
  },
});

export default EditWorkIndustryScreen;
