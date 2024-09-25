import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import CustomText from "../../components/CustomText";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { t } from "i18next";
import Dropdown from "../../components/Dropdown";
import { Formik } from "formik";
import * as Yup from "yup";
import WrongIcon from "../../assets/svg/close-circle-wrong.svg";
import CorrectIcon from "../../assets/svg/minus-tick-correct.svg";
import ErrorText from "../../components/ErrorText";
import { BottomSheetBackdrop, BottomSheetModal } from "@gorhom/bottom-sheet";
import OnboardingHeading from "../../components/OnboardingHeading";
import OTPInputView from "@twotalltotems/react-native-otp-input";
import { TouchableOpacity } from "react-native";
import { postPhoneVerification } from "../../services/Login/send-phone-verification";
import useOnboardingStore from "../../store/useOnboardingStore";
import { postVerifyCode } from "../../services/Login/verify-code";
import { updateUserPhone } from "../../services/User/update-user-phone";
import AlertSheet from "../../components/AlertSheet";
import useUserStore from "../../store/useUserStore";

const EditPhoneScreen = () => {
  const [isOpen, setIsOpen] = useState(false);
  const sheetRef = useRef(null);
  const alertSheetRef = useRef(null);
  const [isCodeValid, setIsCodeValid] = useState(true);
  const [resendEnabled, setResendEnabled] = useState(false);
  const [alertSheetProps, setAlertSheetProps] = useState(null);
  const [timer, setTimer] = useState(35);
  const onboardingStore = useOnboardingStore();
  const userStore = useUserStore();

  const validation = Yup.object().shape({
    phone: Yup.string()
      .max(10, t("PHONE_MAX_LENGTH"))
      .min(10, t("PHONE_MIN_LENGTH"))
      .required(t("PHONE_REQUIRED")),
  });

  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else {
      setResendEnabled(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const wrapperPressHandler = () => {
    setIsOpen(false);
    Keyboard.dismiss();
  };

  const sendVerification = async (phoneNumber) => {
    setAlertSheetProps(null)
    sheetRef.current?.present();
    const response = await postPhoneVerification({
      phoneNumber: `${onboardingStore.code}${phoneNumber}`,
    });
    onboardingStore.setIdentifierCode(response.identifierCode);
  };

  const submitFormHandler = async (code) => {
    const data = {
      verificationCode: code,
      identifierCode: onboardingStore.identifierCode,
    };
    if (code && code.length === 6) {
      sheetRef.current?.close();
      setIsCodeValid(true);
      const response = await postVerifyCode(data);
      if (response.isSuccess) {
        const res = await updateUserPhone(`${onboardingStore.code}${onboardingStore.phone}`,onboardingStore.identifierCode);
        if(res.isSuccess) {
          setAlertSheetProps({
            img: require("../../assets/images/done.png"),
            title: t("SUCCESSFULL"),
            desc: t("SUCCESSFULL_DESC"),
          });
          alertSheetRef.current?.present();
          userStore.setUserAccountDetails({
            phoneNumber: `${onboardingStore.code}${onboardingStore.phone}`,
          });
        } else {
          setAlertSheetProps({
            img: require("../../assets/images/cancelled.png"),
            title: t("UNSUCCESSFULL"),
            desc: t("UNSUCCESSFULL_DESC"),
          });
          alertSheetRef.current?.present();
        }
        
      } else {
        setIsCodeValid(false);
      }
    } else {
      setIsCodeValid(false);
    }
  };

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        {...props}
      />
    ),
    []
  );

  const handleResend = async () => {
    if (resendEnabled) {
      setTimer(35);
      setResendEnabled(false);
      const res = await postPhoneVerification({
        phoneNumber: `${onboardingStore.code}${onboardingStore.phone}`,
      });
      onboardingStore.setIdentifierCode(res.identifierCode);
    }
  };

  return (
    <Formik
      initialValues={{ phone: "" }}
      validationSchema={validation}
      onSubmit={(values) => {
        Keyboard.dismiss();
        onboardingStore.setPhone(values.phone);
        sendVerification(values.phone);
      }}
    >
      {({ handleChange, handleBlur, values, errors, touched, submitForm }) => (
        <>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 120 : 0}
          >
            <TouchableWithoutFeedback onPress={wrapperPressHandler}>
              <View style={styles.container}>
                <View style={styles.head}>
                  <Image
                    source={require("../../assets/images/verify.png")}
                    style={styles.img}
                  />
                  <CustomText style={styles.title}>
                    {t("EDIT_PHONE_TITLE")}
                  </CustomText>
                  <CustomText style={styles.desc}>
                    {t("EDIT_PHONE_DESC")}
                  </CustomText>
                </View>
                <View style={styles.action}>
                  <Dropdown isOpen={isOpen} setIsOpen={setIsOpen} />
                  <View>
                    <Input
                      placeholder={t("PHONE_NUMBER")}
                      value={values.phone}
                      onChangeText={handleChange("phone")}
                      onBlur={handleBlur("phone")}
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
                  <Button onPress={submitForm}>
                    {t("SEND_VERIFICATION_CODE")}
                  </Button>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
          {!alertSheetProps &&
            <BottomSheetModal
            ref={sheetRef}
            snapPoints={["85%"]}
            index={0}
            enablePanDownToClose={true}
            backdropComponent={renderBackdrop}
          >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={styles.otp}>
                <OnboardingHeading
                  title={t("OTP_SCREEN_TITLE")}
                  desc={t("OTP_SCREEN_DESC")}
                />
                <CustomText style={styles.phone}>
                  {onboardingStore.code + values.phone}
                </CustomText>
                <OTPInputView
                  style={styles.verificationInputs}
                  pinCount={6}
                  onCodeChanged={() => setIsCodeValid(true)}
                  autoFocusOnLoad
                  codeInputFieldStyle={[
                    styles.input,
                    !isCodeValid ? styles.inputError : null,
                  ]}
                  codeInputHighlightStyle={styles.underlineStyleHighLighted}
                  onCodeFilled={(code) => {
                    submitFormHandler(code);
                  }}
                />
                <View style={styles.resendWrapper}>
                  <CustomText style={styles.text}>
                    {t("DONT_RECEIVE_CODE") + " "}
                  </CustomText>
                  <TouchableOpacity
                    onPress={handleResend}
                    disabled={!resendEnabled}
                  >
                    <CustomText
                      style={[
                        styles.resendText,
                        resendEnabled && styles.resendTextActive,
                      ]}
                    >
                      {resendEnabled
                        ? t("SEND_AGAIN")
                        : `${t("SEND_AGAIN")} ( ${timer} )`}
                    </CustomText>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </BottomSheetModal>}
          {alertSheetProps && <AlertSheet sheetProps={alertSheetProps} sheetRef={alertSheetRef} />}
        </>
      )}
    </Formik>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  head: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 23,
  },
  img: {
    width: 120,
    height: 120,
    marginBottom: 10,
  },
  title: {
    fontWeight: "500",
    fontSize: 36,
    lineHeight: 40,
    color: "#000000",
    textAlign: "center",
    marginBottom: 8,
  },
  desc: {
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 24,
    color: "#51525C",
    textAlign: "center",
  },
  action: {
    gap: 16,
  },
  otp: {
    flex: 1,
    padding: 16,
  },
  phone: {
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 24,
    color: "#000000",
    marginTop: 8,
  },
  verificationInputs: {
    flexDirection: "row",
    gap: 12,
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#EFEFF0",
  },
  input: {
    width: 50,
    height: 56,
    padding: 16,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    fontSize: 16,
    fontWeight: "400",
    textAlign: "center",
    backgroundColor: "white",
    borderColor: "#D1D1D6",
    color: "black",
  },
  inputError: {
    borderColor: "#FF524F",
  },
  resendWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },
  text: {
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 24,
    color: "#51525C",
  },
  resendText: {
    fontWeight: "500",
    color: "red",
    fontSize: 16,
    lineHeight: 24,
  },
  resendTextActive: {
    color: "#4BA30D",
  },
  underlineStyleHighLighted: {
    borderColor: "black",
  },
});
export default EditPhoneScreen;
