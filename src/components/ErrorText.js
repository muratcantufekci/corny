import { StyleSheet, Text } from "react-native";

const ErrorText = ({ message }) => {
  return <Text style={styles.text}>{message}</Text>;
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
