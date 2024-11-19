import React from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  Linking,
  TouchableOpacity,
} from "react-native";
import CustomText from "../../components/CustomText";
import { t } from "i18next";

const PrivacyPolicyScreen = () => {
  const handleLinkPress = async (url) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      console.error(`Cannot open URL: ${url}`);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View>
        <CustomText style={styles.title}>{t("PRIVACY_POLICY")}</CustomText>
        <CustomText style={styles.footer}>
          {t("PRIVACY_POLICY_DATE")}
        </CustomText>
        <CustomText style={styles.paragraph}>
          {t("PRIVACY_POLICY_P1")}
        </CustomText>
        <CustomText style={styles.subHeader}>
          {t("PRIVACY_POLICY_ST1")}
        </CustomText>
        <CustomText style={styles.paragraph}>
          {t("PRIVACY_POLICY_P2")}
        </CustomText>
        <View style={styles.linkContainer}>
          <CustomText style={styles.link}>{t("PRIVACY_POLICY_L1")}</CustomText>
          <CustomText style={styles.link}>{t("PRIVACY_POLICY_L2")}</CustomText>
          <CustomText style={styles.link}>{t("PRIVACY_POLICY_L3")}</CustomText>
          <CustomText style={styles.link}>{t("PRIVACY_POLICY_L4")}</CustomText>
        </View>
        <CustomText style={styles.paragraph}>
          {t("PRIVACY_POLICY_P3")}
        </CustomText>
        <View style={styles.linkContainer}>
          <CustomText style={styles.link}>{t("PRIVACY_POLICY_L5")}</CustomText>
          <CustomText style={styles.link}>{t("PRIVACY_POLICY_L6")}</CustomText>
          <CustomText style={styles.link}>{t("PRIVACY_POLICY_L7")}</CustomText>
        </View>
        <CustomText style={styles.paragraph}>
          {t("PRIVACY_POLICY_P4")}
        </CustomText>
        <CustomText style={styles.paragraph}>
          {t("PRIVACY_POLICY_P5")}
        </CustomText>
        <CustomText style={styles.subHeader}>
          {t("PRIVACY_POLICY_ST2")}
        </CustomText>
        <CustomText style={styles.paragraph}>
          {t("PRIVACY_POLICY_P6")}
        </CustomText>
        <CustomText style={styles.paragraph}>
          {t("PRIVACY_POLICY_P7")}
        </CustomText>
        <View style={styles.linkContainer}>
          <TouchableOpacity
            onPress={() => handleLinkPress("https://policies.google.com/terms")}
          >
            <CustomText style={styles.link}>Google Play</CustomText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              handleLinkPress("https://www.google.com/analytics/terms/")
            }
          >
            <CustomText style={styles.link}>
              Google Analytics for Firebase
            </CustomText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              handleLinkPress("https://firebase.google.com/terms/crashlytics")
            }
          >
            <CustomText style={styles.link}>Firebase Crashlytics</CustomText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              handleLinkPress(
                "https://www.facebook.com/legal/terms/plain_text_terms"
              )
            }
          >
            <CustomText style={styles.link}>Facebook</CustomText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleLinkPress("https://expo.io/terms")}
          >
            <CustomText style={styles.link}>Expo</CustomText>
          </TouchableOpacity>
        </View>
        <CustomText style={styles.paragraph}>
          {t("PRIVACY_POLICY_P8")}
        </CustomText>
        <View style={styles.linkContainer}>
          <CustomText style={styles.link}>{t("PRIVACY_POLICY_L8")}</CustomText>
          <CustomText style={styles.link}>{t("PRIVACY_POLICY_L9")}</CustomText>
          <CustomText style={styles.link}>{t("PRIVACY_POLICY_L10")}</CustomText>
        </View>
        <CustomText style={styles.subHeader}>
          {t("PRIVACY_POLICY_ST3")}
        </CustomText>
        <CustomText style={styles.paragraph}>
          {t("PRIVACY_POLICY_P9")}
        </CustomText>
        <CustomText style={styles.subHeader}>
          {t("PRIVACY_POLICY_ST4")}
        </CustomText>
        <CustomText style={styles.paragraph}>
          {t("PRIVACY_POLICY_P10")}
        </CustomText>
        <CustomText style={styles.subHeader}>
          {t("PRIVACY_POLICY_ST5")}
        </CustomText>
        <CustomText style={styles.paragraph}>
          {t("PRIVACY_POLICY_P11")}
        </CustomText>
        <CustomText style={styles.paragraph}>
          {t("PRIVACY_POLICY_P12")}
        </CustomText>
        <CustomText style={styles.subHeader}>
          {t("PRIVACY_POLICY_ST6")}
        </CustomText>
        <CustomText style={styles.paragraph}>
          {t("PRIVACY_POLICY_P13")}
        </CustomText>
        <CustomText style={styles.subHeader}>
          {t("PRIVACY_POLICY_ST7")}
        </CustomText>
        <CustomText style={styles.paragraph}>
          {t("PRIVACY_POLICY_P14")}
        </CustomText>
        <CustomText style={styles.subHeader}>
          {t("PRIVACY_POLICY_ST8")}
        </CustomText>
        <CustomText style={styles.paragraph}>
          {t("PRIVACY_POLICY_P15")}
        </CustomText>
        <CustomText style={styles.subHeader}>
          {t("CONTACT_US")}
        </CustomText>
        <CustomText style={styles.paragraph}>
          {t("PRIVACY_POLICY_P16")}
        </CustomText>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginBottom: 36,
  },
  title: {
    fontSize: 26,
    fontWeight: "600",
    lineHeight: 30,
    color: "#000000",
    marginBottom: 16,
  },
  paragraph: {
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 24,
    color: "#51525C",
    marginBottom: 12,
  },
  subHeader: {
    fontSize: 18,
    fontWeight: "500",
    lineHeight: 24,
    color: "#000000",
    marginVertical: 16,
  },
  linkContainer: {
    marginVertical: 12,
  },
  link: {
    fontWeight: "400",
    fontSize: 16,
    color: "#000000",
    lineHeight: 24,
    textDecorationLine: "underline",
    marginBottom: 8,
  },
  footer: {
    marginBottom: 16,
    fontSize: 14,
    color: "#888",
  },
});

export default PrivacyPolicyScreen;
