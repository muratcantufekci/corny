import React from "react";
import { Keyboard, StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import ProggressBar from "../../components/ProggressBar";
import OnboardingHeading from "../../components/OnboardingHeading";
import { t } from "i18next";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { Formik } from "formik";
import * as Yup from "yup";
import WrongIcon from "../../assets/svg/close-circle-wrong.svg";
import CorrectIcon from "../../assets/svg/minus-tick-correct.svg";
import ErrorText from "../../components/ErrorText";
import { useNavigation } from "@react-navigation/native";

const validation = Yup.object().shape({
  mail: Yup.string().email(t("MAIL_FORMAT")).required(t("MAIL_REQUIRED")),
});

const MailScreen = () => {
    const navigation = useNavigation();
  return (
    <Formik
      initialValues={{ mail: "" }}
      validationSchema={validation}
      onSubmit={() => navigation.navigate("OnboardingEnd")}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
      }) => (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <View>
              <ProggressBar step={7} />
              <OnboardingHeading
                title={t("MAIL_SCREEN_TITLE")}
                style={styles.textArea}
              />
              <Input
                placeholder={t("MAIL")}
                onChangeText={handleChange("mail")}
                onBlur={handleBlur("mail")}
                value={values.mail}
                variant={
                  (touched.mail && errors.mail && "error") ||
                  (touched.mail && !errors.mail && "success")
                }
                afterIcon={
                  (touched.mail && errors.mail && <WrongIcon />) ||
                  (touched.mail && !errors.mail && <CorrectIcon />)
                }
              />
              {touched.mail && errors.mail && (
                <ErrorText message={errors.mail} />
              )}
            </View>
            <Button variant="primary" onPress={handleSubmit}>{t("NEXT")}</Button>
          </View>
        </TouchableWithoutFeedback>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  textArea: {
    marginBottom: 24,
  },
});

export default MailScreen;
