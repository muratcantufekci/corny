import { StyleSheet, View } from "react-native";

const ProggressBar = ({ step, totalStep, fromProfileCard }) => {
  return (
    <View style={styles.wrapper}>
      {Array.from({ length: totalStep }).map((_, index) => (
        <View
          style={[
            styles.step,
            index + 1 <= step && styles.activeStep,
            fromProfileCard && { height: 4 },
          ]}
          key={index}
        ></View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    paddingHorizontal: 40,
    marginBottom: 32,
    marginTop: 16,
  },
  step: {
    width: 36,
    height: 8,
    borderRadius: 999,
    backgroundColor: "#F5F5F5",
  },
  activeStep: {
    backgroundColor: "#FF524F",
  },
});

export default ProggressBar;
