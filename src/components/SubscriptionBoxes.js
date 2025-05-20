import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import CustomText from "./CustomText";
import { t } from "i18next";

const SubscriptionBoxes = () => {
  const subscriptionData = [
    {
      id: 1,
      duration: "1",
      price: "US$ 20.99",
      pricePerMonth: "",
      label: "",
    },
    {
      id: 2,
      duration: "3",
      price: "US$ 50.00",
      pricePerMonth: "US$ 16.67/m",
      label: "POPULAR",
    },
    {
      id: 3,
      duration: "6",
      price: "US$ 70.00",
      pricePerMonth: "US$ 11.67/m",
      label: "-80%",
    },
  ];
  const [selectedBox, setSelectedBox] = useState(2);

  return (
    <View style={styles.container}>
      {subscriptionData.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={[
            styles.box,
            selectedBox === item.id ? styles.selectedBox : styles.unselectedBox,
          ]}
          onPress={() => setSelectedBox(item.id)}
        >
          {item.label ? (
            <View
              style={[
                styles.labelContainer,
                item.label === "POPULAR"
                  ? styles.popularLabel
                  : styles.discountLabel,
              ]}
            >
              <CustomText style={styles.labelText}>{item.label}</CustomText>
            </View>
          ) : null}
          <CustomText
            style={[
              styles.durationText,
              selectedBox === item.id
                ? styles.selectedText
                : styles.unselectedText,
            ]}
          >
            {item.duration}
          </CustomText>
          <CustomText
            style={[
              styles.months,
              selectedBox === item.id
                ? styles.selectedText
                : styles.unselectedText,
            ]}
          >
            {t("MONTH")}
          </CustomText>
          {item.pricePerMonth ? (
            <CustomText
              style={[
                styles.pricePerMonthText,
                selectedBox === item.id
                  ? styles.selectedPerMonthText
                  : styles.unselectedText,
              ]}
            >
              {item.pricePerMonth}
            </CustomText>
          ) : null}
          <CustomText
            style={[
              styles.priceText,
              selectedBox === item.id
                ? styles.selectedText
                : styles.unselectedText,
            ]}
          >
            {item.price}
          </CustomText>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  box: {
    flex: 1,
    height: 205,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    borderWidth: 1,
    borderColor: "#FFFFFF",
  },
  selectedBox: {
    backgroundColor: "#000",
  },
  unselectedBox: {
    backgroundColor: "#F5F5F5",
  },
  labelContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  popularLabel: {
    backgroundColor: "#FF4642",
  },
  discountLabel: {
    backgroundColor: "#66C61C",
  },
  labelText: {
    fontWeight: "500",
    fontSize: 12,
    lineHeight: 16,
    color: "#000000",
  },
  durationText: {
    fontWeight: "500",
    fontSize: 32,
    lineHeight: 40,
    color: "#000000",
    marginBottom: 8,
    marginTop: 16
  },
  months: {
    fontWeight: "500",
    fontSize: 14,
    lineHeight: 20,
    color: "#000000",
    marginBottom: 16
  },
  priceText: {
    fontWeight: "500",
    fontSize: 16,
    lineHeight: 21,
    marginTop: 8,
  },
  pricePerMonthText: {
    fontWeight: "400",
    fontSize: 12,
    lineHeight: 20
  },
  selectedText: {
    color: "#FFF",
  },
  selectedPerMonthText: {
    color: "#FF524F"
  },
  unselectedText: {
    color: "#000",
  },
});

export default SubscriptionBoxes;
