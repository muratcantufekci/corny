import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import CustomText from "./CustomText";
import Check from "../assets/svg/check.svg";

const RadioButton = ({ text, code, icon, selected, selectedItemIdSetter, disable = false }) => {
  const radioPressHandler = () => {
    selectedItemIdSetter(code);
  };
  return (
    <TouchableOpacity
      style={[styles.container, selected && styles.containerSelected, disable && styles.containerDisabled]}
      onPress={radioPressHandler}
      disabled={disable}
    >
      {selected ? (
        <Check width={20} height={20} style={styles.check} />
      ) : (
        <View style={styles.radio}></View>
      )}
      <CustomText style={styles.text}>{text}</CustomText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D1D1D6",
  },
  containerSelected: {
    borderWidth: 2,
    borderColor: "#FF524F",
  },
  containerDisabled: {
    backgroundColor: "#EFEFF1"
  }, 
  radio: {
    width: 20,
    height: 20,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#D1D1D6",
    backgroundColor: "#F5F5F5",
  },
  check: {
    color: "#FFFFFF",
  },
  text: {
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 24,
    color: "#70707B",
  },
});

export default RadioButton;
