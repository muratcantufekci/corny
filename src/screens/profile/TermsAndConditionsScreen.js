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

const TermsAndConditionsScreen = () => {
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
        <CustomText style={styles.title}>{t("TERM_AND_CONDITIONS")}</CustomText>
        <CustomText style={styles.footer}>
          {t("TERM_AND_CONDITIONS_DATE")}
        </CustomText>
        <CustomText style={styles.paragraph}>
          {t("TERM_AND_CONDITIONS_P1")}
        </CustomText>
        <CustomText style={styles.paragraph}>
          {t("TERM_AND_CONDITIONS_P2")}
        </CustomText>
        <CustomText style={styles.paragraph}>
          {t("TERM_AND_CONDITIONS_P3")}
        </CustomText>
        <CustomText style={styles.paragraph}>
          {t("TERM_AND_CONDITIONS_P4")}
        </CustomText>
        <CustomText style={styles.paragraph}>
          {t("TERM_AND_CONDITIONS_P5")}
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
          {t("TERM_AND_CONDITIONS_P6")}
        </CustomText>
        <CustomText style={styles.paragraph}>
          {t("TERM_AND_CONDITIONS_P7")}
        </CustomText>
        <CustomText style={styles.paragraph}>
          {t("TERM_AND_CONDITIONS_P8")}
        </CustomText>
        <CustomText style={styles.paragraph}>
          {t("TERM_AND_CONDITIONS_P9")}
        </CustomText>
        <CustomText style={styles.paragraph}>
          {t("TERM_AND_CONDITIONS_P10")}
        </CustomText>
        <CustomText style={styles.subHeader}>
          {t("TERM_AND_CONDITIONS_ST1")}
        </CustomText>
        <CustomText style={styles.paragraph}>
          {t("TERM_AND_CONDITIONS_P11")}
        </CustomText>
        <CustomText style={styles.subHeader}>
          {t("TERM_AND_CONDITIONS_ST2")}
        </CustomText>
        <CustomText style={styles.paragraph}>
          {t("TERM_AND_CONDITIONS_P12")}
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

export default TermsAndConditionsScreen;
