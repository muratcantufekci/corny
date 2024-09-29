import {
  Keyboard,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import OnboardingHeading from "../../components/OnboardingHeading";
import useOnboardingStore from "../../store/useOnboardingStore";
import Button from "../../components/Button";
import { useEffect, useState } from "react";
import { postPhoneVerification } from "../../services/Login/send-phone-verification";
import { postVerifyCode } from "../../services/Login/verify-code";
import { useNavigation } from "@react-navigation/native";
import CustomText from "../../components/CustomText";
import OTPInputView from "@twotalltotems/react-native-otp-input";
import { t } from "i18next";
import { authenticate } from "../../services/Login/authenticate";
import useUserStore from "../../store/useUserStore";
import * as SecureStore from "expo-secure-store";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const PhoneCodeScreen = () => {
  const onboardingStore = useOnboardingStore();
  const userStore = useUserStore();
  const [timer, setTimer] = useState(20);
  const [resendEnabled, setResendEnabled] = useState(false);
  const [isCodeValid, setIsCodeValid] = useState(true);
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const uuid = SecureStore.getItem("DEVICE_UUID_KEY");
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

  const handleResend = async () => {
    if (resendEnabled) {
      setTimer(20);
      setResendEnabled(false);
      const res = await postPhoneVerification(data);
      onboardingStore.setIdentifierCode(res.identifierCode);
    }
  };

  const submitFormHandler = async (code) => {
    const data = {
      verificationCode: code,
      identifierCode: onboardingStore.identifierCode,
    };
    if (code && code.length === 6) {
      setIsCodeValid(true);
      const response = await postVerifyCode(data);
      if (response.isSuccess) {
        const authData = {
          verificationCode: code,
          identifierCode: onboardingStore.identifierCode,
          deviceUuid: "242141-12432141-213432142"
        };
        const res = await authenticate(authData);
        if (res.isSuccess) {
          userStore.setToken(res.token);
          await SecureStore.setItemAsync("refresh_token", res.refreshToken);
          if (res.isConfigured) {
            userStore.setIsUserLoggedIn(true);
          } else {
            navigation.navigate("Navigation");
          }
        }
      } else {
        setIsCodeValid(false);
      }
    } else {
      setIsCodeValid(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View
        style={[
          styles.wrapper,
          {
            paddingBottom: insets.bottom,
          },
        ]}
      >
        <View>
          <OnboardingHeading
            title={t("OTP_SCREEN_TITLE")}
            desc={t("OTP_SCREEN_DESC")}
          />
          <CustomText style={styles.phone}>{onboardingStore.phone}</CustomText>
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
            <TouchableOpacity onPress={handleResend} disabled={!resendEnabled}>
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
        <Button variant="primary" onPress={() => submitFormHandler()}>
          {t("CONTİNUE")}
        </Button>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: "space-between",
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

export default PhoneCodeScreen;
