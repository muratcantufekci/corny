import React from "react";
import { View } from "react-native";
import CustomText from "../../components/CustomText";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ExploreScreen = () => {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        paddingTop: insets.top,
      }}
    >
      <CustomText>Explore Screen</CustomText>
    </View>
  );
};

export default ExploreScreen;
