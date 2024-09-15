import React, { useLayoutEffect, useRef, useState } from "react";
import {
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
import AlertSheet from "../../components/AlertSheet";
import { postEmail } from "../../services/User/send-email";

const validation = Yup.object().shape({
  email: Yup.string().required(t("MAIL_REQUIRED")),
});

const EditMailScreen = ({ navigation }) => {
  const userStore = useUserStore();
  const sheetRef = useRef(null);
  const [sheetProps, setSheetProps] = useState(null);

  const saveBtnPressHandler = async (email) => {
    if (email !== userStore.userAccountDetails.email) {
      const response = await postEmail(email);
      
      if (response.isSuccess) {
        userStore.setUserAccountDetails({
          email: email,
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
  };

  return (
    <>
      <Formik
        initialValues={{
          email: userStore.userAccountDetails.email,
        }}
        validationSchema={validation}
        onSubmit={(values) => {
          Keyboard.dismiss();
          saveBtnPressHandler(values.email);
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
              headerRight: () => (
                <Pressable onPress={submitForm}>
                  <CustomText>{t("SAVE")}</CustomText>
                </Pressable>
              ),
            });
          }, [navigation, submitForm]);

          return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={styles.container}>
                <Input
                  value={values.email}
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  variant={
                    (touched.email && errors.email && "error") ||
                    (touched.email && !errors.email && "success")
                  }
                  afterIcon={
                    (touched.email && errors.email && <WrongIcon />) ||
                    (touched.email && !errors.email && <CorrectIcon />)
                  }
                />
                {touched.email && errors.email && (
                  <ErrorText message={errors.email} />
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

export default EditMailScreen;
