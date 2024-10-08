import React, { useLayoutEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import WrongIcon from "../../assets/svg/close-circle-wrong.svg";
import CorrectIcon from "../../assets/svg/minus-tick-correct.svg";
import { t } from "i18next";
import CustomText from "../../components/CustomText";
import Input from "../../components/Input";
import AlertSheet from "../../components/AlertSheet";
import ErrorText from "../../components/ErrorText";
import OnboardingHeading from "../../components/OnboardingHeading";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { postContactForm } from "../../services/User/send-contact-form";
import Button from "../../components/Button";

const ContactUsScreen = ({ navigation }) => {
  const sheetRef = useRef(null);
  const [sheetProps, setSheetProps] = useState(null);
  const [inputScrollEnabled, setInputScrollEnabled] = useState(false);
  const [waiting, setWaiting] = useState(false);

  const validation = Yup.object().shape({
    name: Yup.string().required(t("NAME_REQUIRED")),
    email: Yup.string()
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        t("MAIL_FORMAT")
      )
      .required(t("MAIL_REQUIRED")),
    phone: Yup.string()
      .max(10, t("PHONE_MAX_LENGTH"))
      .min(10, t("PHONE_MIN_LENGTH"))
      .required(t("PHONE_REQUIRED")),
    message: Yup.string().required(t("MESSAGE_REQUIRED")),
  });

  const saveBtnPressHandler = async (name, email, phoneNumber, message) => {
    setWaiting(true);
    const data = {
      message,
      phoneNumber,
      email,
      name,
    };
    const response = await postContactForm(data);
    if (response.isSuccess) {
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
    setWaiting(false);
  };

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1 }}
      enableOnAndroid={true}
      extraScrollHeight={Platform.OS === "ios" ? 100 : 100}
      keyboardShouldPersistTaps="handled"
      keyboardOpeningTime={Number.MAX_SAFE_INTEGER}
    >
      <Formik
        initialValues={{
          name: "",
          email: "",
          phone: "",
          message: "",
        }}
        validationSchema={validation}
        onSubmit={(values, { resetForm }) => {
          Keyboard.dismiss();
          saveBtnPressHandler(
            values.name,
            values.email,
            values.phone,
            values.message
          ).then(() => {
            resetForm();
          });
        }}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => {
          return (
            <View style={styles.container}>
              <OnboardingHeading
                title={t("CONTACT_US_TITLE")}
                desc={t("CONTACT_US_DESC")}
              />
              <View style={styles.fields}>
                <View>
                  <Input
                    placeholder={t("NAME")}
                    onChangeText={handleChange("name")}
                    onBlur={handleBlur("name")}
                    value={values.name}
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
                <View>
                  <Input
                    placeholder={t("MAIL")}
                    onChangeText={handleChange("email")}
                    onBlur={handleBlur("email")}
                    value={values.email}
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
                <View>
                  <Input
                    placeholder={t("YOUR_PHONE_NUMBER")}
                    onChangeText={handleChange("phone")}
                    onBlur={handleBlur("phone")}
                    value={values.phone}
                    inputMode="numeric"
                    variant={
                      (touched.phone && errors.phone && "error") ||
                      (touched.phone && !errors.phone && "success")
                    }
                    afterIcon={
                      (touched.phone && errors.phone && <WrongIcon />) ||
                      (touched.phone && !errors.phone && <CorrectIcon />)
                    }
                  />
                  {touched.phone && errors.phone && (
                    <ErrorText message={errors.phone} />
                  )}
                </View>
                <View>
                  <Input
                    placeholder={t("WRITE_YOUR_MESSAGE")}
                    onChangeText={handleChange("message")}
                    onEndEditing={handleBlur("message")}
                    onBlur={() => setInputScrollEnabled(false)}
                    value={values.message}
                    onFocus={() => {
                      setTimeout(() => {
                        setInputScrollEnabled(true);
                      }, 1000);
                    }}
                    variant={
                      (touched.message && errors.message && "error") ||
                      (touched.message && !errors.message && "success")
                    }
                    afterIcon={
                      (touched.message && errors.message && <WrongIcon />) ||
                      (touched.message && !errors.message && <CorrectIcon />)
                    }
                    style={{ height: 150 }}
                    multiline={true}
                    numberOfLines={10}
                    isTextArea={true}
                    scrollEnabled={inputScrollEnabled}
                  />
                  {touched.message && errors.message && (
                    <ErrorText message={errors.message} />
                  )}
                </View>
                <Button
                  variant="primary"
                  onPress={handleSubmit}
                  disabled={waiting}
                >
                  {waiting ? <ActivityIndicator /> : t("SAVE")}
                </Button>
              </View>
            </View>
          );
        }}
      </Formik>
      {sheetProps && <AlertSheet sheetProps={sheetProps} sheetRef={sheetRef} />}
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    paddingHorizontal: 16
  },
  fields: {
    marginTop: 32,
    gap: 16,
    paddingBottom: 32,
  },
});

export default ContactUsScreen;
