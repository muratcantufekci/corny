import React, { useCallback } from "react";
import { Image, StyleSheet, View } from "react-native";
import CustomText from "./CustomText";
import Button from "./Button";
import { BottomSheetBackdrop, BottomSheetModal } from "@gorhom/bottom-sheet";

const AlertSheet = ({ sheetProps, sheetRef }) => {
  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        {...props}
      />
    ),
    []
  );
  return (
    <BottomSheetModal
      ref={sheetRef}
      snapPoints={sheetProps?.btnText ? ["45%"]: ["40%"]}
      index={0}
      enablePanDownToClose={true}
      backdropComponent={renderBackdrop}
    >
      <View style={styles.container}>
        <Image source={sheetProps.img} style={styles.img}/>
        <CustomText style={styles.title}>{sheetProps.title}</CustomText>
        <CustomText style={styles.desc}>{sheetProps.desc}</CustomText>
        {sheetProps.btnText && <Button variant="primary" onPress={sheetProps.btnPress} style={styles.btn}>{sheetProps.btnText}</Button>}
      </View>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 32,
    alignItems: "center"
  },
  img: {
    width: 102,
    height: 102,
    marginBottom: 16
  },
  title: {
    fontWeight: "500",
    fontSize: 28,
    lineHeight: 32,
    color: "#000000",
    textAlign: "center",
    marginBottom: 8
  },
  desc: {
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 24,
    color: "#51525C",
    textAlign: "center"
  },
  btn: {
    marginTop: 24
  }
});

export default AlertSheet;
