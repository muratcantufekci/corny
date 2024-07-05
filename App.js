import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { Image, StyleSheet, Text, View } from "react-native";
import WelcomeScreen from "./src/screens/WelcomeScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import MailSignUpScreen from "./src/screens/MailSignUpScreen";
import ProfileSelectionScreen from "./src/screens/ProfileSelectionScreen";
import { useEffect, useState } from "react";
import HomeScreen from "./src/screens/HomeScreen";
import Logo from './assets/logo.svg'
import OnboardingStartScreen from "./src/screens/onboarding/OnboardingStartScreen";
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

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
      headerBackTitle: 'Geri',
      headerTitle: '',
      headerBackTitleStyle: {
        color: '#045bb3',
        fontSize: 16,
        fontWeight: "700"
      },
      headerTintColor: '#045bb3',
      // animationEnabled: false
    }}
  >
    <Stack.Screen
      name="OnboardingStart"
      component={OnboardingStartScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen name="MailSignup" component={MailSignUpScreen}/>
    <Stack.Screen name="ProfileSelection" component={ProfileSelectionScreen}/>
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

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <View style={styles.splashContainer}>
          <Logo width={120} height={40} style={styles.splasgImg}/>
          <StatusBar style="dark" />
      </View>
    );
  }
  const isLoggedIn = false;
  return (
    <View style={styles.wrapper}>
      <NavigationContainer theme={{ colors: { background: "transparent" } }}>
        {isLoggedIn ? <Text>Hello</Text> :  <AuthStack />}
      </NavigationContainer>
      <StatusBar style="dark" />
    </View>
  );

  // const isLoggedIn = false;
  // return (
  //   <View style={styles.wrapper}>
  //     <NavigationContainer theme={{ colors: { background: "transparent" } }}>
  //       {isLoggedIn ? <Text>Hello</Text> : <AuthStack />}
  //     </NavigationContainer>
  //     <StatusBar style="dark" />
  //   </View>
  // );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF524F',
  },
  splasgImg: {
    color: '#FFFFFF'
  },
  wrapper: {
    flex: 1,
  },
});
