import { StyleSheet } from "react-native";
import CustomText from "./CustomText";

const ErrorText = ({ message }) => {
  return <CustomText style={styles.text}>{message}</CustomText>;
};

const styles = StyleSheet.create({
  text: {
    fontWeight: "400",
    fontSize: 14,
    lineHeight: 20,
    color: '#70707B',
  },
});

export default ErrorText;
