import {
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import OnboardingHeading from "../../components/OnboardingHeading";
import useOnboardingStore from "../../store/useOnboardingStore";
import Button from "../../components/Button";
import { useEffect, useRef, useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { postPhoneVerification } from "../../services/send-phone-verification";
import { postVerifyCode } from "../../services/verify-code";
import { useNavigation } from "@react-navigation/native";

const validation = Yup.object().shape({
  code1: Yup.string().length(1).required(),
  code2: Yup.string().length(1).required(),
  code3: Yup.string().length(1).required(),
  code4: Yup.string().length(1).required(),
  code5: Yup.string().length(1).required(),
  code6: Yup.string().length(1).required(),
});

const PhoneCodeScreen = () => {
  const onboardingStore = useOnboardingStore();
  const inputRefs = useRef([]);
  const [timer, setTimer] = useState(20);
  const [resendEnabled, setResendEnabled] = useState(false);
  const [isCodeValid, setIsCodeValid] = useState(true);
  const navigation = useNavigation();
  const data = {
    phoneNumber: onboardingStore.phone,
  };
  useEffect(() => {
    const verifyPhone = async () => {
      try {
        const res = await postPhoneVerification(data);
        onboardingStore.setIdentifierCode(res.identifierCode);
      } catch (error) {
        console.error(error);
      }
    };

    verifyPhone();
  }, []);

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

  const handleTextChange = (text, index, handleChangeFunc) => {
    handleChangeFunc(text);
    if (text.length === 1 && index < 5) {
      inputRefs.current[index + 1].focus();
    } else if (text.length === 0 && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleResend = async () => {
    if (resendEnabled) {
      setTimer(20);
      setResendEnabled(false);
      const res = await postPhoneVerification(data);
      onboardingStore.setIdentifierCode(res.identifierCode);
    }
  };

  const submitFormHandler = async (data, resetForm) => {
    const response = await postVerifyCode(data);
    if (response.isSuccess) {
      setIsCodeValid(true)
      navigation.navigate("Navigation");
    } else {
      setIsCodeValid(false)
    }
    resetForm();
  };

  return (
    <Formik
      initialValues={{
        code1: "",
        code2: "",
        code3: "",
        code4: "",
        code5: "",
        code6: "",
      }}
      validationSchema={validation}
      onSubmit={(values, { resetForm }) => {
        const data = {
          verificationCode: `${values.code1}${values.code2}${values.code3}${values.code4}${values.code5}${values.code6}`,
          identifierCode: onboardingStore.identifierCode,
        };
        submitFormHandler(data, resetForm);
      }}
    >
      {({ handleChange, handleBlur, handleSubmit, errors, touched, values }) => (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.wrapper}>
            <View>
              <OnboardingHeading
                title="OTP'yi girin"
                desc="Corny, numaranızı doğrulamak için size SMS yoluyla tek kullanımlık bir şifre gönderecek"
              />
              <Text style={styles.phone}>{onboardingStore.phone}</Text>
              <View style={styles.verificationInputs}>
                {Array.from({ length: 6 }).map((_, index) => (
                  <TextInput
                    key={index}
                    inputMode="numeric"
                    value={values[`code${index + 1}`]}
                    style={[
                      styles.input,
                      (touched[`code${index + 1}`] &&
                        errors[`code${index + 1}`]) || !isCodeValid &&
                        styles.inputError,
                    ]}
                    maxLength={1}
                    ref={(el) => (inputRefs.current[index] = el)}
                    onBlur={handleBlur(`code${index + 1}`)}
                    onChangeText={(text) =>
                      handleTextChange(
                        text,
                        index,
                        handleChange(`code${index + 1}`)
                      )
                    }
                  />
                ))}
              </View>
              <View style={styles.resendWrapper}>
                <Text style={styles.text}>Kodunuzu almadınız mı? </Text>
                <TouchableOpacity
                  onPress={handleResend}
                  disabled={!resendEnabled}
                >
                  <Text
                    style={[
                      styles.resendText,
                      resendEnabled && styles.resendTextActive,
                    ]}
                  >
                    {resendEnabled
                      ? "Yeniden gönder"
                      : `Yeniden gönder (${timer})`}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <Button variant="black" onPress={handleSubmit}>
              Devam Et
            </Button>
          </View>
        </TouchableWithoutFeedback>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: "space-between",
    paddingBottom: 50,
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
    flex: 1,
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
});

export default PhoneCodeScreen;
