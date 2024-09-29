import React, { useLayoutEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  Pressable,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import useUserStore from "../../../store/useUserStore";
import { Formik } from "formik";
import * as Yup from "yup";
import WrongIcon from "../../../assets/svg/close-circle-wrong.svg";
import CorrectIcon from "../../../assets/svg/minus-tick-correct.svg";
import { t } from "i18next";
import { postUserAbouts } from "../../../services/User/send-user-about";
import CustomText from "../../../components/CustomText";
import Input from "../../../components/Input";
import ErrorText from "../../../components/ErrorText";
import AlertSheet from "../../../components/AlertSheet";

const EditDreamVacationScreen = ({ navigation }) => {
  const userStore = useUserStore();
  const sheetRef = useRef(null);
  const [sheetProps, setSheetProps] = useState(null);
  const [waiting, setWaiting] = useState(false);
  const initialDreamVacation = userStore.userAbouts.find(
    (item) => item.title === "DreamVacation"
  )?.values[0];

  const validation = Yup.object().shape({
    dreamVacation: Yup.string().required(t("DREAMVACATION_REQUIRED")),
  });

  const saveBtnPressHandler = async (text) => {
    setWaiting(true);
    if (text !== initialDreamVacation) {
      const data = {
        title: "DreamVacation",
        values: [`${text}`],
      };

      const response = await postUserAbouts(data);
      if (response.isSuccess) {
        userStore.setUserAbouts([data]);
        setSheetProps({
          img: require("../../../assets/images/done.png"),
          title: t("SUCCESSFULL"),
          desc: t("SUCCESSFULL_DESC"),
        });
        sheetRef.current?.present();
      } else {
        setSheetProps({
          img: require("../../../assets/images/cancelled.png"),
          title: t("UNSUCCESSFULL"),
          desc: t("UNSUCCESSFULL_DESC"),
        });
        sheetRef.current?.present();
      }
    } else {
      setSheetProps({
        img: require("../../../assets/images/warning.png"),
        title: t("WARNING"),
        desc: t("WARNING_DESC"),
      });
      sheetRef.current?.present();
    }
    setWaiting(false);
  };

  return (
    <>
      <Formik
        initialValues={{
          dreamVacation: initialDreamVacation,
        }}
        validationSchema={validation}
        onSubmit={(values) => {
          Keyboard.dismiss();
          saveBtnPressHandler(values.dreamVacation);
        }}
      >
        {({
          handleChange,
          handleBlur,
          values,
          errors,
          touched,
          submitForm,
        }) => {
          useLayoutEffect(() => {
            navigation.setOptions({
              headerRight: () =>
                waiting ? (
                  <ActivityIndicator />
                ) : (
                  <Pressable onPress={submitForm}>
                    <CustomText>{t("SAVE")}</CustomText>
                  </Pressable>
                ),
            });
          }, [navigation, submitForm, waiting]);

          return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={styles.container}>
                <Input
                  value={values.dreamVacation}
                  onChangeText={handleChange("dreamVacation")}
                  onBlur={handleBlur("dreamVacation")}
                  variant={
                    (touched.dreamVacation &&
                      errors.dreamVacation &&
                      "error") ||
                    (touched.dreamVacation &&
                      !errors.dreamVacation &&
                      "success")
                  }
                  afterIcon={
                    (touched.dreamVacation && errors.dreamVacation && (
                      <WrongIcon />
                    )) ||
                    (touched.dreamVacation && !errors.dreamVacation && (
                      <CorrectIcon />
                    ))
                  }
                />
                {touched.dreamVacation && errors.dreamVacation && (
                  <ErrorText message={errors.dreamVacation} />
                )}
              </View>
            </TouchableWithoutFeedback>
          );
        }}
      </Formik>
      {sheetProps && <AlertSheet sheetProps={sheetProps} sheetRef={sheetRef} />}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
});

export default EditDreamVacationScreen;
