import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
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
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import "./src/lang/i18n";
import PhotoScreen from "./src/screens/onboarding/PhotoScreen";
import MovieScreen from "./src/screens/onboarding/MovieScreen";
import GenderScreen from "./src/screens/onboarding/GenderScreen";
import BirthdayScreen from "./src/screens/onboarding/BirthdayScreen";
import MailScreen from "./src/screens/onboarding/MailScreen";
import OnboardingEndScreen from "./src/screens/onboarding/OnboardingEndScreen";
import Back from "./src/assets/svg/arrow-left.svg"

const Stack = createStackNavigator();
// const Tab = createBottomTabNavigator();

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
      headerBackImage: () => (
        <Back width={30} height={30}/>
      ),
      headerTitle: "",
      headerTintColor: "#045bb3",
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

// const AppTabs = () => (
//   <Tab.Navigator>
//     <Tab.Screen name="Home" component={HomeScreen} />
//     <Tab.Screen name="Profile" component={ProfileScreen} />
//   </Tab.Navigator>
// );

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  const [fontsLoaded, error] = useFonts({
    "RethinkSans-Regular": require("./src/assets/fonts/RethinkSans-Regular.ttf"),
    "RethinkSans-Medium": require("./src/assets/fonts/RethinkSans-Medium.ttf"),
    "RethinkSans-SemiBold": require("./src/assets/fonts/RethinkSans-SemiBold.ttf"),
    "RethinkSans-Bold": require("./src/assets/fonts/RethinkSans-Bold.ttf"),
    "RethinkSans-ExtraBold": require("./src/assets/fonts/RethinkSans-ExtraBold.ttf"),
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (fontsLoaded || error) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

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

  const isLoggedIn = false;

  return (
    <View style={styles.wrapper}>
      <NavigationContainer theme={{ colors: { background: "transparent" } }}>
        {isLoggedIn ? <Text>Hello</Text> : <AuthStack />}
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
