import React, { useCallback } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import CustomText from "./CustomText";
import Button from "./Button";
import { BottomSheetBackdrop, BottomSheetModal } from "@gorhom/bottom-sheet";
import Minus from "../assets/svg/minus-negative.svg";
import Check from "../assets/svg/check.svg";
import Cross from "../assets/svg/cross.svg";
import SubscriptionBoxes from "./SubscriptionBoxes";
import { t } from "i18next";

const PremiumSheet = ({ sheetRef }) => {
  const data = [
    { feature: "Premium filters", basic: true, premium: true },
    { feature: "See who likes you", basic: false, premium: true },
    { feature: "No ads", basic: false, premium: true },
    { feature: "Change location", basic: false, premium: true },
    { feature: "Blurry profile", basic: true, premium: false },
    { feature: "Rewind profile", basic: false, premium: true },
    { feature: "Unlimited swipes", basic: true, premium: true },
    { feature: "1 Boost/month", basic: false, premium: true },
    { feature: "Nearby", basic: false, premium: true },
    { feature: "Views", basic: true, premium: false },
  ];

  const handleLinkPress = async (url) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    }
  };

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        {...props}
      />
    ),
    []
  );
  return (
    <BottomSheetModal
      ref={sheetRef}
      snapPoints={["93%"]}
      index={0}
      enablePanDownToClose={true}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: "#FF524F" }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.wrapper}>
          <TouchableOpacity
            style={styles.close}
            onPress={() => sheetRef.current?.close()}
          >
            <Cross style={styles.cross} width={18} />
          </TouchableOpacity>
        </View>
        <CustomText style={styles.title}>{t("PREMIUM")}</CustomText>
        <CustomText style={styles.desc}>{t("PREMIUM_DESC")}</CustomText>
        <View style={styles.featuresContainer}>
          <View style={styles.headerRow}>
            <CustomText style={[styles.cell, styles.featureCell]}></CustomText>
            <View style={[styles.headerItem, styles.cell]}>
              <CustomText style={styles.header}>
                {t("BASIC").toUpperCase()}
              </CustomText>
            </View>
            <View style={[styles.headerItem, styles.cell]}>
              <CustomText style={styles.header}>
                {t("PREMIUM").toUpperCase()}
              </CustomText>
            </View>
          </View>

          {data.map((row, index) => (
            <View key={index} style={styles.row}>
              <View style={styles.featureCell}>
                <CustomText style={[styles.featureCellText]}>
                  {row.feature}
                </CustomText>
              </View>
              <View style={styles.cell}>
                {row.basic ? (
                  <Check width={22} style={styles.check} />
                ) : (
                  <Minus width={34} height={34} />
                )}
              </View>
              <View style={styles.cell}>
                {row.premium ? (
                  <Check width={22} style={styles.check} />
                ) : (
                  <Minus width={34} height={34} />
                )}
              </View>
            </View>
          ))}
        </View>
        <SubscriptionBoxes />
        <View style={styles.info}>
          <CustomText style={styles.infoText}>
            {t("PREMIUM_INFO_T1")}
          </CustomText>
          <CustomText style={styles.infoText}>
            {t("PREMIUM_INFO_T2")}
          </CustomText>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <TouchableOpacity
              onPress={() =>
                handleLinkPress("https://cornyapp.com/gizlilik-politikasi/")
              }
            >
              <CustomText style={[styles.infoText, styles.policy]}>
                {t("PRIVACY_POLICY")}
              </CustomText>
            </TouchableOpacity>
            <CustomText style={styles.infoText}> {t("AND")} </CustomText>
            <TouchableOpacity
              onPress={() =>
                handleLinkPress("https://cornyapp.com/kullanim-kosullari/")
              }
            >
              <CustomText style={[styles.infoText, styles.policy]}>
                {t("TERM_AND_CONDITIONS")}
              </CustomText>
            </TouchableOpacity>
          </View>
          <CustomText style={styles.infoText}>
            {t("PREMIUM_INFO_T3")}
          </CustomText>
        </View>
        <Button variant="primary" style={styles.btn}>
          {t("CONTİNUE")}
        </Button>
      </ScrollView>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    alignItems: "center",
    backgroundColor: "#FF524F",
    paddingBottom: 32,
  },
  title: {
    fontWeight: "500",
    fontSize: 36,
    lineHeight: 40,
    color: "#000000",
    textAlign: "center",
    marginBottom: 8,
  },
  desc: {
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 24,
    color: "#000000",
    textAlign: "center",
  },
  btn: {
    marginTop: 30,
  },
  wrapper: {
    width: "100%",
    alignItems: "flex-end",
  },
  close: {
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#EFEFF1",
  },
  cross: {
    color: "#51525C",
  },
  featuresContainer: {
    width: "100%",
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#FFF5F5",
    marginVertical: 32,
  },
  headerRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    gap: 16,
    marginTop: 6,
  },
  cell: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  featureCell: {
    flex: 2,
    justifyContent: "center",
  },
  featureCellText: {
    fontWeight: "600",
    fontSize: 14,
    lineHeight: 24,
    color: "#51525C",
  },
  headerItem: {
    padding: 4,
    borderRadius: 4,
    backgroundColor: "#FF524F",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    fontWeight: "500",
    fontSize: 14,
    lineHeight: 16,
    color: "black",
  },
  check: {
    color: "#481211",
  },
  info: {
    marginTop: 32,
  },
  infoText: {
    fontWeight: "400",
    fontSize: 12,
    lineHeight: 16,
    textAlign: "center",
    color: "#FFFFFF",
  },
  policy: {
    color: "#FFFFFF",
    textDecorationLine: "underline",
  },
});

export default PremiumSheet;
