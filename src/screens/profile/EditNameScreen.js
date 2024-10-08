import React, { useLayoutEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  Pressable,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Input from "../../components/Input";
import useUserStore from "../../store/useUserStore";
import CustomText from "../../components/CustomText";
import { Formik } from "formik";
import * as Yup from "yup";
import WrongIcon from "../../assets/svg/close-circle-wrong.svg";
import CorrectIcon from "../../assets/svg/minus-tick-correct.svg";
import { t } from "i18next";
import ErrorText from "../../components/ErrorText";
import { postUsername } from "../../services/User/send-name";
import AlertSheet from "../../components/AlertSheet";

const EditNameScreen = ({ navigation }) => {
  const userStore = useUserStore();
  const sheetRef = useRef(null);
  const [sheetProps, setSheetProps] = useState(null);
  const [waiting, setWaiting] = useState(false);

  const validation = Yup.object().shape({
    name: Yup.string().required(t("NAME_REQUIRED")),
  });

  const saveBtnPressHandler = async (name) => {
    setWaiting(true);
    if (name !== userStore.userAccountDetails.name) {
      const response = await postUsername(name);
      if (response.isSuccess) {
        userStore.setUserAccountDetails({
          name: name,
        });
        setSheetProps({
          img: require("../../assets/images/done.png"),
          title: t("SUCCESSFULL"),
          desc: t("SUCCESSFULL_DESC"),
        });
        sheetRef.current?.present();
      } else {
        setSheetProps({
          img: require("../../assets/images/cancelled.png"),
          title: t("UNSUCCESSFULL"),
          desc: t("UNSUCCESSFULL_DESC"),
        });
        sheetRef.current?.present();
      }
    } else {
      setSheetProps({
        img: require("../../assets/images/warning.png"),
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
          name: userStore.userAccountDetails.name,
        }}
        validationSchema={validation}
        onSubmit={(values) => {
          Keyboard.dismiss();
          saveBtnPressHandler(values.name);
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
                  value={values.name}
                  onChangeText={handleChange("name")}
                  onBlur={handleBlur("name")}
                  variant={
                    (touched.name && errors.name && "error") ||
                    (touched.name && !errors.name && "success")
                  }
                  afterIcon={
                    (touched.name && errors.name && <WrongIcon />) ||
                    (touched.name && !errors.name && <CorrectIcon />)
                  }
                />
                {touched.name && errors.name && (
                  <ErrorText message={errors.name} />
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
    paddingHorizontal: 16
  },
});

export default EditNameScreen;
