import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import WrongIcon from "../../assets/svg/close-circle-wrong.svg";
import CorrectIcon from "../../assets/svg/minus-tick-correct.svg";
import { t } from "i18next";
import Input from "../../components/Input";
import AlertSheet from "../../components/AlertSheet";
import ErrorText from "../../components/ErrorText";
import OnboardingHeading from "../../components/OnboardingHeading";
import Button from "../../components/Button";
import { postReportForm } from "../../services/User/send-report-form";
import { useIsFocused } from "@react-navigation/native";
import useAppUtils from "../../store/useAppUtils";

const ReportUserScreen = ({ route }) => {
  const sheetRef = useRef(null);
  const [sheetProps, setSheetProps] = useState(null);
  const [inputScrollEnabled, setInputScrollEnabled] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const { otherUserId } = route.params;
  const isFocused = useIsFocused();
  const appUtils = useAppUtils();

  useEffect(() => {
      if (isFocused) {
        appUtils.setBackgroundColor("#FFFFFF");
      }
    }, [isFocused]);

  const validation = Yup.object().shape({
    subject: Yup.string().required(t("SUBJECT_REQUIRED")),
    message: Yup.string().required(t("MESSAGE_REQUIRED")),
  });

  const saveBtnPressHandler = async (topic, message) => {
    setWaiting(true);
    const data = {
      Topic: topic,
      Message: message,
      ReportedUserId: otherUserId,
    };
    const response = await postReportForm(data);

    if (response.isSuccess) {
      setSheetProps({
        img: require("../../assets/images/done.png"),
        title: t("SUCCESSFULL"),
        desc: t("SUCCESSFULL_CONTACT"),
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
    <>
      <Formik
        initialValues={{
          subject: "",
          message: "",
        }}
        validationSchema={validation}
        onSubmit={(values, { resetForm }) => {
          Keyboard.dismiss();
          saveBtnPressHandler(values.subject, values.message).then(() => {
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
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={styles.container}>
                <OnboardingHeading
                  title={t("REPORT_USER_TITLE")}
                  desc={t("REPORT_USER_DES")}
                />
                <View style={styles.fields}>
                  <View>
                    <Input
                      placeholder={t("SUBJECT")}
                      onChangeText={handleChange("subject")}
                      onBlur={handleBlur("subject")}
                      value={values.subject}
                      inputMode="subject"
                      variant={
                        (touched.subject && errors.subject && "error") ||
                        (touched.subject && !errors.subject && "success")
                      }
                      afterIcon={
                        (touched.subject && errors.subject && <WrongIcon />) ||
                        (touched.subject && !errors.subject && <CorrectIcon />)
                      }
                    />
                    {touched.subject && errors.subject && (
                      <ErrorText message={errors.subject} />
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
                </View>
                <Button
                  variant="primary"
                  onPress={handleSubmit}
                  disabled={waiting}
                >
                  {waiting ? <ActivityIndicator /> : t("SAVE")}
                </Button>
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
    paddingHorizontal: 16,
  },
  fields: {
    marginTop: 32,
    gap: 16,
    paddingBottom: 32,
  },
});

export default ReportUserScreen;
