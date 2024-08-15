import CustomText from "../../components/CustomText";
import ProggressBar from "../../components/ProggressBar";
import OnboardingHeading from "../../components/OnboardingHeading";
import Input from "../../components/Input";
import {
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Button from "../../components/Button";
import * as Yup from "yup";
import { Formik } from "formik";
import ErrorText from "../../components/ErrorText";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import WrongIcon from "../../assets/svg/close-circle-wrong.svg";
import CorrectIcon from "../../assets/svg/minus-tick-correct.svg";
import { postUsername } from "../../services/send-name";
import { useEffect } from "react";

const NameScreen = ({ route }) => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  useEffect(() => {
    if (route.params?.disableBack) {
      navigation.setOptions({
        headerLeft: () => null,
      });
    }
  }, [navigation, route.params?.disableBack]);

  const validation = Yup.object().shape({
    name: Yup.string().required(t("NAME_REQUIRED")),
  });

  const submitHandler = async (name) => {
    const response = await postUsername(name)
    if(response.isSuccess) {
      navigation.navigate("Photo");
    }
  }

  return (
    <Formik
      initialValues={{
        name: "",
      }}
      validationSchema={validation}
      onSubmit={(values) => {
        submitHandler(values.name)
      }}
    >
      {({ handleChange, handleBlur, handleSubmit, errors, touched }) => (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <View>
              <ProggressBar step={2} />
              <OnboardingHeading
                title={t("NAME_SCREEN_TITLE")}
                desc={t("NAME_SCREEN_DESC")}
                style={styles.textArea}
              />
              <Input
                placeholder={t("WRITE_YOUR_NAME")}
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
            <Button variant="primary" onPress={handleSubmit}>
              {t("NEXT")}
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
    justifyContent: "space-between",
  },
  textArea: {
    marginBottom: 24,
  },
});

export default NameScreen;
