import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import CustomText from "./CustomText";
import { t } from "i18next";

const SubscriptionBoxes = ({
  subscriptionData,
  colors,
  text,
  onPackageSelect,
}) => {
  const [selectedBox, setSelectedBox] = useState(2);

  // İlk yüklemede varsayılan seçili paketi parent'a bildir
  useEffect(() => {
    if (subscriptionData && subscriptionData.length > 0) {
      const defaultSelected =
        subscriptionData.find((item) => item.id === selectedBox) ||
        subscriptionData[0];
      onPackageSelect && onPackageSelect(defaultSelected);
    }
  }, [subscriptionData?.length, selectedBox]); // Sadece length ve selectedBox'ı takip et

  const handleBoxSelect = useCallback(
    (item) => {
      setSelectedBox(item.id);
      // Seçilen paketi parent component'e gönder
      onPackageSelect && onPackageSelect(item);
    },
    [onPackageSelect]
  );

  return (
    <View style={styles.container}>
      {subscriptionData.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={[
            styles.box,
            selectedBox === item.id
              ? {
                  backgroundColor: colors?.selectedBoxColor,
                  borderColor: colors?.boxBorderColor,
                }
              : {
                  backgroundColor: colors?.unselectedBoxColor,
                  borderColor: "#FFFFFF",
                },
          ]}
          onPress={() => handleBoxSelect(item)}
        >
          {item.label ? (
            <View
              style={[
                styles.labelContainer,
                item.label === t("POPULAR")
                  ? styles.popularLabel
                  : styles.discountLabel,
              ]}
            >
              <CustomText style={styles.labelText}>{item.label}</CustomText>
            </View>
          ) : (
            <View style={[styles.labelContainer]}>
              <CustomText style={styles.labelText}>{item.label}</CustomText>
            </View>
          )}
          <CustomText
            style={[
              styles.durationText,
              selectedBox === item.id
                ? { color: colors?.selectedTextColor }
                : { color: "#000" },
            ]}
          >
            {item.duration}
          </CustomText>
          <CustomText
            style={[
              styles.months,
              selectedBox === item.id
                ? { color: colors?.selectedTextColor }
                : { color: "#000" },
            ]}
          >
            {text}
          </CustomText>
          {/* {item.pricePerMonth ? (
            <CustomText
              style={[
                styles.pricePerMonthText,
                selectedBox === item.id
                  ? { color: colors?.selectedPerMonthTextColor }
                  : { color: "#000" },
              ]}
            >
              {item.pricePerMonth}
            </CustomText>
          ) : (
            <CustomText style={[styles.pricePerMonthText]}>
              {item.pricePerMonth}
            </CustomText>
          )} */}
          <CustomText
            style={[
              styles.priceText,
              selectedBox === item.id
                ? { color: colors?.selectedTextColor }
                : { color: "#000" },
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
    fontSize: 10,
    lineHeight: 16,
    color: "#000000",
  },
  durationText: {
    fontWeight: "500",
    fontSize: 32,
    lineHeight: 40,
    color: "#000000",
    marginBottom: 8,
    marginTop: 16,
  },
  months: {
    fontWeight: "500",
    fontSize: 14,
    lineHeight: 20,
    color: "#000000",
    marginBottom: 16,
  },
  priceText: {
    fontWeight: "500",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
  },
  pricePerMonthText: {
    fontWeight: "400",
    fontSize: 10,
    lineHeight: 20,
  },
  selectedText: {
    color: "#FFF",
  },
  selectedPerMonthText: {
    color: "#FF524F",
  },
  unselectedText: {
    color: "#000",
  },
});

export default SubscriptionBoxes;
