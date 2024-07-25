import {
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { Formik } from "formik";
import * as Yup from "yup";
import ErrorText from "../../components/ErrorText";
import Dropdown from "../../components/Dropdown";
import useOnboardingStore from "../../store/useOnboardingStore";
import { useNavigation } from "@react-navigation/native";
import OnboardingHeading from "../../components/OnboardingHeading";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const NumberScreen = () => {
  const [isOpen, setIsOpen] = useState(false);
  const onboardingStore = useOnboardingStore();
  const navigation = useNavigation();
  const { t } = useTranslation();

  const validation = Yup.object().shape({
    phone: Yup.string()
      .max(10, t("PHONE_MAX_LENGTH"))
      .min(10, t("PHONE_MIN_LENGTH"))
      .required(t("PHONE_REQUIRED")),
  });

  const phoneInputChangeHandler = (text, handleChangeFunc) => {
    handleChangeFunc(text);
    onboardingStore.setPhone(onboardingStore.code + text);
  };

  const pageWrapperPressHandler = () => {
    Keyboard.dismiss()
    setIsOpen(false)
  }

  return (
    <Formik
      initialValues={{ phone: "" }}
      validationSchema={validation}
      onSubmit={() => navigation.navigate("PhoneCode")}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
      }) => (
        <TouchableWithoutFeedback onPress={pageWrapperPressHandler}>
          <View style={styles.container}>
            <View>
              <OnboardingHeading
                title={t('NUMBER_SCREEN_TITLE')}
                desc={t('NUMBER_SCREEN_DESC')}
              />
              <View style={styles.content}>
                <Dropdown isOpen={isOpen} setIsOpen={setIsOpen}/>
                <Input
                  placeholder={t('PHONE_NUMBER')}
                  onChangeText={(text) =>
                    phoneInputChangeHandler(text, handleChange("phone"))
                  }
                  onBlur={handleBlur("phone")}
                  value={values.phone}
                  variant={
                    (touched.phone && errors.phone && "error") ||
                    (touched.phone && !errors.phone && "success")
                  }
                  inputMode="numeric"
                />
                {touched.phone && errors.phone && (
                  <ErrorText message={errors.phone} />
                )}
              </View>
            </View>
            <Button variant="primary" onPress={handleSubmit}>
              {t('CONTİNUE')}
            </Button>
          </View>
        </TouchableWithoutFeedback>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    justifyContent: "space-between",
    paddingBottom: 50,
  },
  content: {
    marginTop: 32,
    gap: 16,
  },
});

export default NumberScreen;
