import { Picker } from "@react-native-picker/picker";
import React, { useLayoutEffect, useRef, useState, useEffect } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import CustomText from "../../../components/CustomText";
import { t } from "i18next";
import { postUserAbouts } from "../../../services/User/send-user-about";
import useUserStore from "../../../store/useUserStore";
import AlertSheet from "../../../components/AlertSheet";

const EditHeightScreen = ({ navigation }) => {
  const userStore = useUserStore();
  const sheetRef = useRef(null);
  const [sheetProps, setSheetProps] = useState(null);
  const [selectedHeight, setSelectedHeight] = useState(
    userStore.userAbouts.find((item) => item.title === "Height")?.values
  );
  const initialHeight = userStore.userAbouts.find(
    (item) => item.title === "Height"
  )?.values;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={saveBtnPressHandler}>
          <CustomText>{t("SAVE")}</CustomText>
        </Pressable>
      ),
    });
  }, [navigation, selectedHeight]);

  useEffect(() => {
    if (sheetProps) {
      sheetRef.current?.present();
    }
  }, [sheetProps]);

  const saveBtnPressHandler = async () => {
    if (initialHeight !== selectedHeight) {
      const data = {
        title: "Height",
        values: selectedHeight,
      };

      const response = await postUserAbouts(data);

      if (response.isSuccess) {
        setSheetProps({
          img: require("../../../assets/images/done.png"),
          title: t("SUCCESSFULL"),
          desc: t("SUCCESSFULL_DESC"),
        });
        userStore.setUserAbouts([data]);
      } else {
        setSheetProps({
          img: require("../../../assets/images/cancelled.png"),
          title: t("UNSUCCESSFULL"),
          desc: t("UNSUCCESSFULL_DESC"),
        });
      }
    } else {
      setSheetProps({
        img: require("../../../assets/images/warning.png"),
        title: t("WARNING"),
        desc: t("WARNING_DESC"),
      });
    }
  };

  return (
    <View style={styles.container}>
      <Picker
        selectedValue={selectedHeight}
        onValueChange={(itemValue) => setSelectedHeight([itemValue])}
        mode="dropdown"
      >
        <Picker.Item label="<90 cm" value="<90" />
        {Array.from({ length: 129 }, (_, i) => (
          <Picker.Item key={i} label={`${i + 91} cm`} value={`${i + 91}`} />
        ))}
        <Picker.Item label="220> cm" value="220>" />
      </Picker>
      {sheetProps && <AlertSheet sheetProps={sheetProps} sheetRef={sheetRef} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
});

export default EditHeightScreen;
