import React, { useEffect } from "react";
import { Dimensions, Image, StyleSheet, View } from "react-native";
import CustomText from "../../components/CustomText";
import Button from "../../components/Button";
import { t } from "i18next";
import useUserStore from "../../store/useUserStore";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getDeviceInfo } from "../../helper/getDeviceInfo";
import { postMarketingEvents } from "../../services/Event/send-marketing-event";

const OnboardingEndScreen = () => {
  const userStore = useUserStore();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const postRegistration = async () => {
      const deviceInfo = await getDeviceInfo();
      const registrationData = {
        deviceInfo,
        eventType: "Registration",
        fbc: "",
      };
      const registrationRespone = await postMarketingEvents(registrationData);
    };
    postRegistration();
  }, []);

  const discoverBtnPressHandler = () => {
    userStore.setIsUserLoggedIn(true);
  };
  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: insets.bottom + 16,
        },
      ]}
    >
      <View>
        <Image
          source={require("../../assets/images/production-corny.png")}
          style={styles.img}
        />
        <CustomText style={styles.title}>{t("END_SCREEN_TITLE")}</CustomText>
        <CustomText style={styles.desc}>{t("END_SCREEN_DESC")}</CustomText>
      </View>
      <Button variant="primary" onPress={discoverBtnPressHandler}>
        {t("DISCOVER")}
      </Button>
    </View>
  );
};

const imgHeight = Dimensions.get("window").height / 1.8;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  img: {
    width: 360,
    height: imgHeight,
    marginBottom: 40,
    objectFit: "contain",
  },
  title: {
    fontWeight: "500",
    fontSize: 26,
    lineHeight: 30,
    textAlign: "center",
    color: "#000000",
    marginBottom: 8,
  },
  desc: {
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    color: "#51525C",
  },
});

export default OnboardingEndScreen;
