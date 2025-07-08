import React, { useCallback } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import CustomText from "./CustomText";
import Button from "./Button";
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import Cross from "../assets/svg/cross.svg";

const PremiumAlertSheet = ({ sheetProps, sheetRef, premiumSheetRef }) => {
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

  const btnPressHandler = () => {
    sheetRef.current?.dismiss();
    premiumSheetRef.current?.present();
  };

  return (
    <BottomSheetModal
      ref={sheetRef}
      snapPoints={["90%"]}
      index={0}
      enablePanDownToClose={true}
      backdropComponent={renderBackdrop}
    >
      <BottomSheetScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
      >
        <View style={styles.wrapper}>
          <TouchableOpacity
            style={styles.close}
            onPress={() => sheetRef.current?.close()}
          >
            <Cross style={styles.cross} width={18} />
          </TouchableOpacity>
        </View>
        <Image source={sheetProps.img} style={styles.img} />
        <CustomText style={styles.title}>{sheetProps.title}</CustomText>
        <CustomText style={styles.desc}>{sheetProps.desc}</CustomText>
        <Button variant="primary" style={styles.btn} onPress={btnPressHandler}>
          {sheetProps.btnText}
        </Button>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    alignItems: "center",
    paddingBottom: 24
  },
  img: {
    width: 316,
    height: 380,
    marginBottom: 24,
  },
  title: {
    fontWeight: "500",
    fontSize: 36,
    lineHeight: 40,
    color: "#000000",
    textAlign: "center",
    marginBottom: 8,
  },
  desc: {
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 24,
    color: "#51525C",
    textAlign: "center",
  },
  btn: {
    marginTop: 30,
  },
  wrapper: {
    width: "100%",
    alignItems: "flex-end",
    marginBottom: 30,
  },
  close: {
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#EFEFF1",
  },
  cross: {
    color: "#51525C",
  },
});

export default PremiumAlertSheet;
