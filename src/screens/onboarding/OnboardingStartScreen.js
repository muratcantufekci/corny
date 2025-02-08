import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  Platform,
  Alert,
} from "react-native";
import CustomText from "../../components/CustomText";
import Button from "../../components/Button";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as AppleAuthentication from "expo-apple-authentication";
import { authenticateWithApple } from "../../services/Login/login-with-apple";
import { AppEventsLogger } from "react-native-fbsdk-next";
import useUserStore from "../../store/useUserStore";
import * as SecureStore from "expo-secure-store";
import Apple from "../../assets/svg/apple-icon.svg";
import Google from "../../assets/svg/google-icon.svg";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import auth from "@react-native-firebase/auth";
import { postLog } from "../../services/Test/insert-log";
import { authenticateWithGoogle } from "../../services/Login/authenticate-with-google";

const OnboardingStartScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const userStore = useUserStore();

  if (Platform.OS === "ios") {
    GoogleSignin.configure({
      iosClientId:
        "824446959819-lls6q9nbdtae8d39n8hclkvt6u9iqj9d.apps.googleusercontent.com",
    });
  } else {
    GoogleSignin.configure({
      webClientId:
        "824446959819-lls6q9nbdtae8d39n8hclkvt6u9iqj9d.apps.googleusercontent.com",
    });
  }

  const continuePressHandler = () => {
    navigation.navigate("NumberEnter");
  };

  const continueWithAppleHandler = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync();
      const data = {
        fullName: "",
        email: "",
        userIdentifier: credential.user,
        jwtToken: credential.identityToken,
      };
      const response = await authenticateWithApple(data);
      if (response.isSuccess) {
        AppEventsLogger.setUserID(response.userUniqueId);
        userStore.setToken(response.token);
        await SecureStore.setItemAsync("refresh_token", response.refreshToken);
        if (response.isConfigured) {
          userStore.setIsUserLoggedIn(true);
        } else {
          navigation.navigate("Navigation");
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const continueWithGoogleHandler = async () => {
    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      const signInResult = await GoogleSignin.signIn();

      const data = {
        givenName: signInResult.data?.user?.givenName,
        familyName: "",
        email: signInResult.data?.user?.email,
        sub: signInResult.data?.user?.id,
        jwtToken: signInResult.data?.idToken,
      };
      const response = await authenticateWithGoogle(data);
      if (response.isSuccess) {
        AppEventsLogger.setUserID(response.userUniqueId);
        userStore.setToken(response.token);
        await SecureStore.setItemAsync("refresh_token", response.refreshToken);
        if (response.isConfigured) {
          userStore.setIsUserLoggedIn(true);
        } else {
          navigation.navigate("Navigation");
        }
      }

    } catch (error) {
      console.error("error", error);
      const data = {
        topic: "Google signin Error",
        logMessage: "Errorrr",
      };
      const googleResp = await postLog(data);
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: insets.bottom + 16,
        },
      ]}
    >
      <View>
        <Image
          source={require("../../assets/images/corns.png")}
          style={styles.img}
        />
        <CustomText style={styles.text}>{t("START_SCREEN_TEXT")}</CustomText>
      </View>
      <View style={styles.btns}>
        <Button
          variant="primary"
          style={styles.button}
          onPress={continuePressHandler}
        >
          {t("CONTİNUE_W_PHONE")}
        </Button>
        {Platform.OS === "ios" ? (
          <Button
            variant="ghost"
            style={styles.button}
            prevIcon={<Apple />}
            onPress={continueWithAppleHandler}
          >
            {t("CONTİNUE_W_APPLE")}
          </Button>
        ) : (
          <Button
            variant="ghost"
            style={styles.button}
            prevIcon={<Google />}
            onPress={continueWithGoogleHandler}
          >
            {t("CONTİNUE_W_GOOGLE")}
          </Button>
        )}
      </View>
    </View>
  );
};

const imgMargin = Dimensions.get("window").height / 20;
const imgHeight = Dimensions.get("window").height / 1.9;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
    justifyContent: "space-between",
    padding: 16,
  },
  img: {
    marginTop: imgMargin,
    width: 360,
    height: imgHeight,
  },
  text: {
    fontSize: 26,
    fontWeight: "500",
    lineHeight: 30,
    letterSpacing: -0.03,
    textAlign: "center",
    paddingHorizontal: 30,
  },
  btns: {
    width: "100%",
    gap: 8,
  },
});

export default OnboardingStartScreen;
