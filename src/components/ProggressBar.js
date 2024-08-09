import { StyleSheet, View } from "react-native";

const ProggressBar = ({step}) => {
  return (
    <View style={styles.wrapper}>
      {Array.from({ length: 7 }).map((_, index) => (
        <View style={[styles.step, index + 1 <= step && styles.activeStep]} key={index}></View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    paddingHorizontal: 40,
    marginBottom: 32,
    marginTop: 16
  },
  step: {
    flex: 1,
    height: 8,
    borderRadius: 999,
    backgroundColor: "#F5F5F5",
  },
  activeStep: {
    backgroundColor: '#FF524F',
  }
});

export default ProggressBar;
