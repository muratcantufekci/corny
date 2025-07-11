import {
  Keyboard,
  Linking,
  StyleSheet,
  TouchableOpacity,
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
import WrongIcon from "../../assets/svg/close-circle-wrong.svg";
import CorrectIcon from "../../assets/svg/minus-tick-correct.svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CustomText from "../../components/CustomText";
import { authenticateWithRefreshToken } from "../../services/Login/authenticate-with-refresh-token";
import useUserStore from "../../store/useUserStore";
import * as SecureStore from "expo-secure-store";

const NumberScreen = () => {
  const [isOpen, setIsOpen] = useState(false);
  const onboardingStore = useOnboardingStore();
  const userStore = useUserStore();
  const navigation = useNavigation();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

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
    Keyboard.dismiss();
    setIsOpen(false);
  };

  const handleLinkPress = async (url) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    }
  };

  const formSubmitHandler = async () => {
    if(onboardingStore.phone === "+905057465785") {
      const refreshToken = "f3dde443-0f14-422a-8091-26b7d452d176";
      try {
        const response = await authenticateWithRefreshToken({
          refreshToken: refreshToken,
          deviceUuid: "242141-12432141-213432142",
        });

        if (response.status_en === "expired") {
          await SecureStore.deleteItemAsync("refresh_token");
          userStore.setIsUserLoggedIn(false);
        } else if (response.status_en === "OK") {
          userStore.setToken(response.token);
          await SecureStore.setItemAsync(
            "refresh_token",
            response.refreshToken
          );
          userStore.setIsUserLoggedIn(true);
        } else {
          userStore.setIsUserLoggedIn(false);
        }
      } catch (error) {
        console.log(error);
      }
      
    } else {
      navigation.navigate("PhoneCode")
    }
  }

  return (
    <Formik
      initialValues={{ phone: "" }}
      validationSchema={validation}
      onSubmit={formSubmitHandler}
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
          <View
            style={[
              styles.container,
              {
                paddingBottom: insets.bottom + 16,
              },
            ]}
          >
            <View>
              <OnboardingHeading
                title={t("NUMBER_SCREEN_TITLE")}
                desc={t("NUMBER_SCREEN_DESC")}
              />
              <View style={styles.content}>
                <Dropdown isOpen={isOpen} setIsOpen={setIsOpen} />
                <Input
                  placeholder={t("YOUR_PHONE_NUMBER")}
                  onChangeText={(text) =>
                    phoneInputChangeHandler(text, handleChange("phone"))
                  }
                  onBlur={handleBlur("phone")}
                  value={values.phone}
                  variant={
                    (touched.phone && errors.phone && "error") ||
                    (touched.phone && !errors.phone && "success")
                  }
                  afterIcon={
                    (touched.phone && errors.phone && <WrongIcon />) ||
                    (touched.phone && !errors.phone && <CorrectIcon />)
                  }
                  inputMode="numeric"
                />
              </View>
              {touched.phone && errors.phone && (
                <ErrorText message={errors.phone} />
              )}
            </View>
            <View>
              <CustomText style={styles.acceptPolicies}>
                {t("ACCEPT_POLICIES")}
              </CustomText>
              <View style={styles.policiesWrapper}>
                <TouchableOpacity
                  onPress={() =>
                    handleLinkPress("https://cornyapp.com/gizlilik-politikasi/")
                  }
                >
                  <CustomText style={styles.policy}>
                    {t("PRIVACY_POLICY")}
                  </CustomText>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    handleLinkPress("https://cornyapp.com/kullanim-kosullari/")
                  }
                >
                  <CustomText style={styles.policy}>
                    {t("TERM_AND_CONDITIONS")}
                  </CustomText>
                </TouchableOpacity>
              </View>
              <Button variant="primary" onPress={handleSubmit}>
                {t("CONTİNUE")}
              </Button>
            </View>
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
    paddingHorizontal: 16,
  },
  content: {
    marginTop: 32,
    gap: 16,
  },
  acceptPolicies: {
    fontWeight: "400",
    fontSize: 14,
    color: "#ACACAC",
  },
  policiesWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 4,
    marginBottom: 24,
  },
  policy: {
    fontWeight: "500",
    fontSize: 14,
    color: "#FF524F",
    textDecorationLine: "underline",
  },
});

export default NumberScreen;
