import { StyleSheet, View } from "react-native";
import CustomText from "./CustomText";

const OnboardingHeading = ({ title, desc, style }) => {
  return (
    <View style={style}>
      {title && <CustomText style={styles.headingText}>{title}</CustomText>} 
      {desc && <CustomText style={styles.descText}>{desc}</CustomText>} 
    </View>
  );
};

const styles = StyleSheet.create({
  headingText: {
    fontSize: 26,
    fontWeight: "500",
    lineHeight: 30,
    color: "#000000",
    marginBottom: 8,
  },
  descText: {
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 16,
    color: "#51525C",
  },
})

export default OnboardingHeading;
