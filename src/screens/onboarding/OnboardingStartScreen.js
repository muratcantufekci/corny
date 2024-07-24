import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import CustomText from "../../components/CustomText";
import Button from "../../components/Button";
import { useNavigation } from "@react-navigation/native";

const OnboardingStartScreen = () => {
  const navigation = useNavigation();

  const continuePressHandler = () => {
    navigation.navigate("NumberEnter");
  };
  return (
    <View style={styles.container}>
      <View>
        <Image source={require("../../assets/images/corns.png")} style={styles.img} />
        <CustomText style={styles.text}>
          Sizin gibi düşünen insanlarla eşleşin!
        </CustomText>
      </View>
      <Button
        variant="primary"
        style={styles.button}
        onPress={continuePressHandler}
      >
        Telefonla Devam Et
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
    justifyContent: "space-between",
    paddingBottom: 50,
  },
  img: {
    marginTop: 60,
    width: 360,
    height: 450,
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
