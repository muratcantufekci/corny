import React, { useCallback } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import CustomText from "./CustomText";
import Button from "./Button";
import { BottomSheetBackdrop, BottomSheetModal } from "@gorhom/bottom-sheet";
import { t } from "i18next";
import Cross from "../assets/svg/cross.svg";
import SubscriptionBoxes from "./SubscriptionBoxes";

const UtilitySheet = ({ sheetProps, sheetRef }) => {
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
      snapPoints={["93%"]}
      index={0}
      enablePanDownToClose={true}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: sheetProps.backgroundColor }}
    >
      <View style={styles.container}>
        <View style={styles.wrapper}>
          <TouchableOpacity
            style={styles.close}
            onPress={() => sheetRef.current?.dismiss()}
          >
            <Cross style={styles.cross} width={18} />
          </TouchableOpacity>
        </View>
        <Image source={sheetProps.img} style={styles.img} />
        <CustomText style={styles.title}>{sheetProps.title}</CustomText>
        <CustomText style={styles.desc}>{sheetProps.desc}</CustomText>
        <SubscriptionBoxes
          subscriptionData={sheetProps.subscriptionData}
          colors={{
            boxBorderColor: sheetProps.boxBorderColor,
            selectedBoxColor: sheetProps.selectedBoxColor,
            unselectedBoxColor: sheetProps.unselectedBoxColor,
            selectedTextColor: "#000",
            selectedPerMonthTextColor: "#000",
          }}
          text={sheetProps.text}
        />
        <Button
          variant="primary"
          onPress={sheetProps.btnPress}
          style={styles.btn}
        >
          {t("CONTİNUE")}
        </Button>
      </View>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 32,
    alignItems: "center",
  },
  img: {
    width: 160,
    height: 160,
    marginBottom: 16,
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
    marginBottom: 32,
  },
  btn: {
    marginTop: 80,
  },
  wrapper: {
    width: "100%",
    alignItems: "flex-end",
  },
  close: {
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
  },
  cross: {
    color: "#51525C",
  },
});

export default UtilitySheet;
