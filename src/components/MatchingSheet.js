import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import { Image } from "expo-image";
import React, { useCallback, useEffect, useState } from "react";
import {
  Keyboard,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CustomText from "./CustomText";
import { t } from "i18next";
import Input from "./Input";
import ArrowUp from "../assets/svg/arrow-up-circle.svg";
import Cross from "../assets/svg/cross.svg";
import { postSwipeMessage } from "../services/Matching/send-message";
import { useNavigation } from "@react-navigation/native";

const MatchingSheet = ({ sheetRef, sheetProps, setMessageSend }) => {
  const insets = useSafeAreaInsets();
  const [message, setMessage] = useState("");
  const navigation = useNavigation();

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        style={{ paddingTop: insets.top }}
        {...props}
      />
    ),
    []
  );

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        sheetRef.current?.snapToIndex(1);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        sheetRef.current?.snapToIndex(0);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const messageSendHandler = async () => {
    const data = {
      swipedUserId: sheetProps?.swipedUserId,
      message: message,
    };
    sheetRef.current?.close()
    const response = await postSwipeMessage(data);
    setMessageSend && setMessageSend(true)
  };

  return (
    <BottomSheetModal
      ref={sheetRef}
      snapPoints={["60%", "90%"]}
      index={0}
      backdropComponent={renderBackdrop}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.sheetWrapper}>
          <TouchableOpacity
            style={styles.close}
            onPress={() => {
              sheetRef.current?.close()
              navigation.canGoBack() && navigation.goBack();
             }}
          >
            <Cross style={{ color: "#51525C" }} />
          </TouchableOpacity>
          <View style={styles.sheetImgs}>
            <Image
              source={{ uri: sheetProps?.myImg }}
              style={[styles.sheetImg, styles.sheetFirstImg]}
            />
            <Image
              source={{ uri: sheetProps?.otherUserImg }}
              style={[styles.sheetImg, styles.sheetSecondImg]}
            />
            <Image
              source={require("../assets/images/beverage.png")}
              style={styles.sheetBeverage}
            />
            <Image
              source={require("../assets/images/ticket.png")}
              style={styles.sheetTicket}
            />
          </View>
          <CustomText style={styles.sheetTitle}>{sheetProps?.title}</CustomText>
          <CustomText style={styles.sheetDesc}>{sheetProps?.desc}</CustomText>
          <View style={styles.inputWrapper}>
            <BottomSheetTextInput
              placeholder={t("WRITE_YOUR_MESSAGE")}
              style={styles.input}
              onChangeText={(text) => setMessage(text)}
            />
            <TouchableOpacity onPress={messageSendHandler}>
              <ArrowUp />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  sheetWrapper: {
    paddingTop: 60,
    paddingHorizontal: 36,
  },
  close: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EFEFF1",
    borderRadius: 12,
    position: "absolute",
    right: 16,
    top: 0,
  },
  sheetImgs: {
    position: "relative",
    zIndex: 3,
    alignItems: "center",
    justifyContent: "center",
    height: 180,
  },
  sheetImg: {
    width: 135,
    height: 145,
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
    borderRadius: 6,
    position: "absolute",
    top: -10,
  },
  sheetFirstImg: {
    right: "50%",
    transform: [{ rotate: "-13deg" }],
    zIndex: 3,
  },
  sheetSecondImg: {
    right: "10%",
    transform: [{ rotate: "13deg" }],
    zIndex: 2,
  },
  sheetBeverage: {
    position: "absolute",
    top: -70,
    right: "37%",
    zIndex: 2,
    width: 65,
    height: 120,
  },
  sheetTicket: {
    position: "absolute",
    top: 80,
    right: "30%",
    zIndex: 4,
    width: 120,
    height: 100,
  },
  sheetTitle: {
    fontWeight: "500",
    fontSize: 36,
    lineHeight: 40,
    color: "#000000",
    textAlign: "center",
    marginBottom: 8,
  },
  sheetDesc: {
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 24,
    color: "#51525C",
    textAlign: "center",
  },
  inputWrapper: {
    marginTop: 32,
    paddingHorizontal: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
  },
  input: {
    paddingVertical: 16,
    flex: 1,
    fontSize: 16,
    fontWeight: "400",
  },
});

export default MatchingSheet;
