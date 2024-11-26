import React, { useEffect, useRef, useState } from "react";
import {
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
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
import { postEmail } from "../../services/User/send-email";
import { checkUserConfiguration } from "../../services/User/check-user-configurations";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AlertSheet from "../../components/AlertSheet";

const validation = Yup.object().shape({
  mail: Yup.string()
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      t("MAIL_FORMAT")
    )
    .required(t("MAIL_REQUIRED")),
});

const MailScreen = ({ route }) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [sheetProps, setSheetProps] = useState(null);
  const sheetRef = useRef(null);

  useEffect(() => {
    if (route.params?.disableBack) {
      navigation.setOptions({
        headerLeft: () => null,
      });
    }
  }, [navigation, route.params?.disableBack]);

  const formSubmitHandler = async (mail) => {
    const response = await postEmail(mail);

    if (response.isSuccess) {
      const response = await checkUserConfiguration();

      if (response.configurationCompleted) {
        navigation.navigate("OnboardingEnd");
      }
    } else {
      if (response.status_en === "Email already in use") {
        setSheetProps({
          img: require("../../assets/images/cancelled.png"),
          title: t("UNSUCCESSFULL"),
          desc: t("MAIL_IN_USE"),
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
    }
  };
  return (
    <>
      <Formik
        initialValues={{ mail: "" }}
        validationSchema={validation}
        onSubmit={(values) => {
          formSubmitHandler(values.mail);
        }}
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
            <View
              style={[
                styles.container,
                {
                  paddingBottom: insets.bottom + 16,
                },
              ]}
            >
              <View>
                <ProggressBar step={7} totalStep={7} />
                <OnboardingHeading
                  title={t("MAIL_SCREEN_TITLE")}
                  style={styles.textArea}
                />
                <Input
                  placeholder={t("MAIL")}
                  onChangeText={handleChange("mail")}
                  onBlur={handleBlur("mail")}
                  value={values.mail}
                  autoCapitalize="none"
                  inputMode="email"
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
              <Button variant="primary" onPress={handleSubmit}>
                {t("NEXT")}
              </Button>
            </View>
          </TouchableWithoutFeedback>
        )}
      </Formik>
      {sheetProps && <AlertSheet sheetProps={sheetProps} sheetRef={sheetRef} />}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  textArea: {
    marginBottom: 24,
  },
});

export default MailScreen;
