import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import {
  createNavigationContainerRef,
  NavigationContainer,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import ProfileSelectionScreen from "./src/screens/ProfileSelectionScreen";
import { useEffect, useState } from "react";
import Logo from "./src/assets/svg/logo.svg";
import OnboardingStartScreen from "./src/screens/onboarding/OnboardingStartScreen";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import NumberScreen from "./src/screens/onboarding/NumberScreen";
import PhoneCodeScreen from "./src/screens/onboarding/PhoneCodeScreen";
import NavigationScreen from "./src/screens/onboarding/NavigationScreen";
import NameScreen from "./src/screens/onboarding/NameScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import "./src/lang/i18n";
import PhotoScreen from "./src/screens/onboarding/PhotoScreen";
import MovieScreen from "./src/screens/onboarding/MovieScreen";
import GenderScreen from "./src/screens/onboarding/GenderScreen";
import BirthdayScreen from "./src/screens/onboarding/BirthdayScreen";
import MailScreen from "./src/screens/onboarding/MailScreen";
import OnboardingEndScreen from "./src/screens/onboarding/OnboardingEndScreen";
import Back from "./src/assets/svg/arrow-left.svg";
import * as SecureStore from "expo-secure-store";
import { authenticateWithRefreshToken } from "./src/services/authenticate-with-refresh-token";
import useUserStore from "./src/store/useUserStore";
import { checkUserConfiguration } from "./src/services/check-user-configurations";
import ExploreScreen from "./src/screens/explore/ExploreScreen";
import LikesScreen from "./src/screens/likes/LikesScreen";
import ChatsScreen from "./src/screens/chats/ChatsScreen";
import ProfileScreen from "./src/screens/profile/ProfileScreen";
import ExplorePassive from "./src/assets/svg/explore-passive.svg";
import ExploreActive from "./src/assets/svg/explore-active.svg";
import LikesPassive from "./src/assets/svg/likes-passive.svg";
import LikesActive from "./src/assets/svg/likes-active.svg";
import ChatsPassive from "./src/assets/svg/chat-passive.svg";
import ChatsActive from "./src/assets/svg/chats-active.svg";
import ProfilePassive from "./src/assets/svg/user.svg";
import ProfileActive from "./src/assets/svg/user-active.svg";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const AuthStack = () => (
  <Stack.Navigator
    screenOptions={{
      transitionSpec: {
        open: {
          animation: "timing",
          config: {
            duration: 100,
          },
        },
        close: {
          animation: "timing",
          config: {
            duration: 100, // Animasyon süresi (milisaniye cinsinden)
          },
        },
      },
      headerBackTitleVisible: false,
      headerBackImage: () => <Back width={30} height={30} />,
      headerTitle: "",
      headerTintColor: "#045bb3",
      gestureEnabled: false,
      // animationEnabled: false
    }}
  >
    <Stack.Screen
      name="OnboardingStart"
      component={OnboardingStartScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen name="NumberEnter" component={NumberScreen} />
    <Stack.Screen name="PhoneCode" component={PhoneCodeScreen} />
    <Stack.Screen name="Navigation" component={NavigationScreen} />
    <Stack.Screen name="Name" component={NameScreen} />
    <Stack.Screen name="Photo" component={PhotoScreen} />
    <Stack.Screen name="Movie" component={MovieScreen} />
    <Stack.Screen name="Gender" component={GenderScreen} />
    <Stack.Screen name="Birthday" component={BirthdayScreen} />
    <Stack.Screen name="Mail" component={MailScreen} />
    <Stack.Screen name="OnboardingEnd" component={OnboardingEndScreen} />
  </Stack.Navigator>
);

const AppTabs = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarStyle: {
        borderTopColor: "#EFEFF1",
        borderTopWidth: 1,
        paddingTop: 16,
        height: 60,
        marginHorizontal: -16,
      },
      tabBarLabelStyle: {
        marginTop: 8,
        fontSize: 12,
        fontWeight: '600'
      },
      tabBarActiveTintColor: '#000000',
      tabBarInactiveTintColor: '#A0A1AB',
    }}
  >
    <Tab.Screen
      name="Explore"
      component={ExploreScreen}
      options={{
        tabBarIcon: ({ focused }) =>
          focused ? (
            <ExploreActive width={24} height={24} />
          ) : (
            <ExplorePassive width={24} height={24} />
          ),
      }}
    />
    <Tab.Screen
      name="Likes"
      component={LikesScreen}
      options={{
        tabBarIcon: ({ focused }) =>
          focused ? (
            <LikesActive width={24} height={24} />
          ) : (
            <LikesPassive width={24} height={24} />
          ),
      }}
    />
    <Tab.Screen
      name="Chats"
      component={ChatsScreen}
      options={{
        tabBarIcon: ({ focused }) =>
          focused ? (
            <ChatsActive width={24} height={24} />
          ) : (
            <ChatsPassive width={24} height={24} />
          ),
      }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        tabBarIcon: ({ focused }) =>
          focused ? (
            <ProfileActive width={24} height={24} />
          ) : (
            <ProfilePassive width={24} height={24} style={{color: "#A0A1AB"}}/>
          ),
      }}
    />
  </Tab.Navigator>
);

const navigationRef = createNavigationContainerRef();

const checkAndRedirect = (response) => {
  const keys = Object.keys(response);

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];

    if (key.startsWith("has") && response[key] === false) {
      switch (key) {
        case "hasLocation":
          navigationRef.current?.navigate("Navigation", { disableBack: true });
          break;
        case "hasName":
          navigationRef.current?.navigate("Name", { disableBack: true });
          break;
        case "hasPictures":
          navigationRef.current?.navigate("Photo", { disableBack: true });
          break;
        case "hasShows":
          navigationRef.current?.navigate("Movie", { disableBack: true });
          break;
        case "hasGender":
          navigationRef.current?.navigate("Gender", { disableBack: true });
          break;
        case "hasBirthday":
          navigationRef.current?.navigate("Birthday", { disableBack: true });
          break;
        case "hasEmail":
          navigationRef.current?.navigate("Mail", { disableBack: true });
          break;
        default:
          break;
      }
      break;
    }
  }
};

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const userStore = useUserStore();

  const [fontsLoaded, error] = useFonts({
    "RethinkSans-Regular": require("./src/assets/fonts/RethinkSans-Regular.ttf"),
    "RethinkSans-Medium": require("./src/assets/fonts/RethinkSans-Medium.ttf"),
    "RethinkSans-SemiBold": require("./src/assets/fonts/RethinkSans-SemiBold.ttf"),
    "RethinkSans-Bold": require("./src/assets/fonts/RethinkSans-Bold.ttf"),
    "RethinkSans-ExtraBold": require("./src/assets/fonts/RethinkSans-ExtraBold.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded || error) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  useEffect(() => {
    const setUserLogin = async () => {
      // await SecureStore.deleteItemAsync("refresh_token"); // test amaçlı refresh token sıfırlayıcı
      const refreshToken = await SecureStore.getItemAsync("refresh_token");

      if (refreshToken) {
        const response = await authenticateWithRefreshToken({
          refreshToken: refreshToken,
        });

        userStore.setToken(response.token);
        await SecureStore.setItemAsync("refresh_token", response.refreshToken);

        if (response.isConfigured) {
          userStore.setIsUserLoggedIn(true);
          setIsLoading(false);
        } else {
          const congifurResponse = await checkUserConfiguration();

          userStore.setIsUserLoggedIn(false);
          setIsLoading(false);
          checkAndRedirect(congifurResponse);
        }
      } else {
        const timer = setTimeout(() => {
          setIsLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
      }
    };

    setUserLogin();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.splashContainer}>
        <Logo width={120} height={40} style={styles.splasgImg} />
        <StatusBar style="dark" />
      </View>
    );
  }

  if (!fontsLoaded && !error) {
    return null;
  }

  return (
    <View style={styles.wrapper}>
      <NavigationContainer
        ref={navigationRef}
        theme={{ colors: { background: "transparent" } }}
      >
        {userStore.isUserLoggedIn ? <AppTabs /> : <AuthStack />}
      </NavigationContainer>
      <StatusBar style="dark" />
    </View>
  );
}

const paddingBottom = Dimensions.get("window").height / 20;

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  splasgImg: {
    color: "#FF524F",
  },
  wrapper: {
    flex: 1,
    padding: 16,
    paddingBottom: paddingBottom,
  },
});
