import React from "react";
import { View, Text, StyleSheet, Image, Dimensions } from "react-native";
import CustomText from "../../components/CustomText";
import Button from "../../components/Button";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

const OnboardingStartScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const continuePressHandler = () => {
    navigation.navigate("NumberEnter");
  };
  return (
    <View style={styles.container}>
      <View>
        <Image
          source={require("../../assets/images/corns.png")}
          style={styles.img}
        />
        <CustomText style={styles.text}>{t("START_SCREEN_TEXT")}</CustomText>
      </View>
      <Button
        variant="primary"
        style={styles.button}
        onPress={continuePressHandler}
      >
        {t("CONTİNUE_W_PHONE")}
      </Button>
    </View>
  );
};

const imgMargin = (Dimensions.get("window").height) / 20;
const imgHeight = (Dimensions.get("window").height) / 1.9;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
    justifyContent: "space-between",
  },
  img: {
    marginTop: imgMargin,
    width: 360,
    height: imgHeight,
  },
  text: {
    fontSize: 26,
    fontWeight: "500",
    lineHeight: 30,
    letterSpacing: -0.03,
    textAlign: "center",
    paddingHorizontal: 30,
  },
  button: {
    alignSelf: "flex-end",
  },
});

export default OnboardingStartScreen;
