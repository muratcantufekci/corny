import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { AppState, StyleSheet, View } from "react-native";
import {
  createNavigationContainerRef,
  NavigationContainer,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useCallback, useEffect, useState } from "react";
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
import useUserStore from "./src/store/useUserStore";
import { checkUserConfiguration } from "./src/services/User/check-user-configurations";
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
import { t } from "i18next";
import ChatHubScreen from "./src/screens/chats/ChatHubScreen";
import useAppUtils from "./src/store/useAppUtils";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { authenticateWithRefreshToken } from "./src/services/Login/authenticate-with-refresh-token";
import EditProfileScreen from "./src/screens/profile/EditProfileScreen";
import CustomText from "./src/components/CustomText";
import AccountDetailsScreen from "./src/screens/profile/AccountDetailsScreen";
import EditNameScreen from "./src/screens/profile/EditNameScreen";
import EditMailScreen from "./src/screens/profile/EditMailScreen";
import EditHeightScreen from "./src/screens/profile/about/EditHeightScreen";
import EditWorkIndustryScreen from "./src/screens/profile/about/EditWorkIndustryScreen";
import EditLookingForScreen from "./src/screens/profile/about/EditLookingForScreen";
import EditEatingHabitsScreen from "./src/screens/profile/about/EditEatingHabitsScreen";
import EditReligiousViewScreen from "./src/screens/profile/about/EditReligiousViewScreen";
import EditEducationScreen from "./src/screens/profile/about/EditEducationScreen";
import EditSmokerScreen from "./src/screens/profile/about/EditSmokerScreen";
import EditExerciseHabitScreen from "./src/screens/profile/about/EditExerciseHabitScreen";
import EditPoliticalViewScreen from "./src/screens/profile/about/EditPoliticalViewScreen";
import EditZodiacScreen from "./src/screens/profile/about/EditZodiacScreen";
import EditRelationshipStyleScreen from "./src/screens/profile/about/EditRelationshipStyleScreen";
import EditInterestScreen from "./src/screens/profile/about/EditInterestScreen";
import EditDreamVacationScreen from "./src/screens/profile/about/EditDreamVacationScreen";
import EditGuiltyPleasureScreen from "./src/screens/profile/about/EditGuiltyPleasureScreen";
import EditCurrentObsessionScreen from "./src/screens/profile/about/EditCurrentObsessionScreen";
import EditLastWatchedScreen from "./src/screens/profile/about/EditLastWatchedScreen";
import EditNotificationPreferences from "./src/screens/profile/EditNotificationPreferences";
import EditLangugePreferencesScreen from "./src/screens/profile/EditLangugePreferencesScreen";
import EditWatchingHabitScreen from "./src/screens/profile/about/EditWatchingHabitScreen";
import EditDrinkingHabitScreen from "./src/screens/profile/about/EditDrinkingHabitScreen";
import EditMoviesScreen from "./src/screens/profile/EditMoviesScreen";
import EditPhoneScreen from "./src/screens/profile/EditPhoneScreen";
import ContactUsScreen from "./src/screens/profile/ContactUsScreen";
import * as Updates from "expo-updates";

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
            duration: 100,
          },
        },
      },
      headerBackTitleVisible: false,
      headerBackImage: () => (
        <View style={{ padding: 10, paddingLeft: 0 }}>
          <Back width={30} height={30} />
        </View>
      ),
      headerTitle: "",
      headerTintColor: "#045bb3",
      gestureEnabled: false,
      headerLeftContainerStyle: {
        paddingLeft: 16,
      },
      headerRightContainerStyle: {
        paddingRight: 16,
      },
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

const MessagesStack = () => {
  return (
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
              duration: 100,
            },
          },
        },
        headerBackTitleVisible: false,
        headerTitle: "",
        headerTintColor: "#045bb3",
      }}
    >
      <Stack.Screen
        name="Messages"
        component={ChatsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MessageHub"
        component={ChatHubScreen}
        options={{
          headerTransparent: false,
          headerStyle: { backgroundColor: "#FEFCF5" },
          cardStyle: { backgroundColor: "#FEFCF5" },
        }}
      />
    </Stack.Navigator>
  );
};

const ProfileStack = () => {
  return (
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
              duration: 100,
            },
          },
        },
        headerBackImage: () => (
          <View style={{ padding: 10, paddingLeft: 0 }}>
            <Back />
          </View>
        ),
        headerBackTitleVisible: false,
        headerTitle: "",
        headerTintColor: "#045bb3",
        headerTransparent: false,
        headerStyle: {
          backgroundColor: "white",
          shadowOpacity: 0,
          elevation: 0,
        },
        headerLeftContainerStyle: {
          paddingLeft: 16,
        },
        headerRightContainerStyle: {
          paddingRight: 16,
        },
        cardStyle: { backgroundColor: "white" },
      }}
    >
      <Stack.Screen
        name="ProfileMain"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{
          headerTitle: () => (
            <CustomText style={styles.profileHeaderText}>
              {t("EDIT_PROFILE")}
            </CustomText>
          ),
        }}
      />
      <Stack.Screen
        name="AccountDetails"
        component={AccountDetailsScreen}
        options={{
          headerTitle: () => (
            <CustomText style={styles.profileHeaderText}>
              {t("ACCOUNT_DETAILS")}
            </CustomText>
          ),
        }}
      />
      <Stack.Screen
        name="NotificationPreferences"
        component={EditNotificationPreferences}
        options={{
          headerTitle: () => (
            <CustomText style={styles.profileHeaderText}>
              {t("NOTIFICATIONS")}
            </CustomText>
          ),
        }}
      />
      <Stack.Screen
        name="LanguagePreferences"
        component={EditLangugePreferencesScreen}
        options={{
          headerTitle: () => (
            <CustomText style={styles.profileHeaderText}>
              {t("LANGUAGES")}
            </CustomText>
          ),
        }}
      />
      <Stack.Screen
        name="ContactUs"
        component={ContactUsScreen}
        options={{
          headerTitle: () => (
            <CustomText style={styles.profileHeaderText}>
              {t("CONTACT_US")}
            </CustomText>
          ),
        }}
      />
      <Stack.Screen
        name="EditMovies"
        component={EditMoviesScreen}
        options={{
          headerTitle: () => (
            <CustomText style={styles.profileHeaderText}>
              {t("ALL_TVSERIES")}
            </CustomText>
          ),
        }}
      />
      <Stack.Screen
        name="EditName"
        component={EditNameScreen}
        options={{
          headerTitle: () => (
            <CustomText style={styles.profileHeaderText}>
              {t("CHANGE_NAME")}
            </CustomText>
          ),
        }}
      />
      <Stack.Screen
        name="EditMail"
        component={EditMailScreen}
        options={{
          headerTitle: () => (
            <CustomText style={styles.profileHeaderText}>
              {t("CHANGE_MAIL")}
            </CustomText>
          ),
        }}
      />
      <Stack.Screen
        name="EditPhone"
        component={EditPhoneScreen}
        options={{
          headerTitle: () => (
            <CustomText style={styles.profileHeaderText}>
              {t("CHANGE_PHONE")}
            </CustomText>
          ),
        }}
      />
      <Stack.Screen
        name="EditHeight"
        component={EditHeightScreen}
        options={{
          headerTitle: () => (
            <CustomText style={styles.profileHeaderText}>
              {t("CHANGE_HEIGHT")}
            </CustomText>
          ),
        }}
      />
      <Stack.Screen
        name="EditWorkIndustry"
        component={EditWorkIndustryScreen}
        options={{
          headerTitle: () => (
            <CustomText style={styles.profileHeaderText}>
              {t("CHANGE_WORKINDUSTRY")}
            </CustomText>
          ),
        }}
      />
      <Stack.Screen
        name="EditLookingFor"
        component={EditLookingForScreen}
        options={{
          headerTitle: () => (
            <CustomText style={styles.profileHeaderText}>
              {t("CHANGE_LOOKINGFOR")}
            </CustomText>
          ),
        }}
      />
      <Stack.Screen
        name="EditEatingHabit"
        component={EditEatingHabitsScreen}
        options={{
          headerTitle: () => (
            <CustomText style={styles.profileHeaderText}>
              {t("CHANGE_EATINGHABITS")}
            </CustomText>
          ),
        }}
      />
      <Stack.Screen
        name="EditReligiousView"
        component={EditReligiousViewScreen}
        options={{
          headerTitle: () => (
            <CustomText style={styles.profileHeaderText}>
              {t("CHANGE_RELIGIOUSVIEW")}
            </CustomText>
          ),
        }}
      />
      <Stack.Screen
        name="EditEducation"
        component={EditEducationScreen}
        options={{
          headerTitle: () => (
            <CustomText style={styles.profileHeaderText}>
              {t("CHANGE_EDUCATION")}
            </CustomText>
          ),
        }}
      />
      <Stack.Screen
        name="EditSmoker"
        component={EditSmokerScreen}
        options={{
          headerTitle: () => (
            <CustomText style={styles.profileHeaderText}>
              {t("CHANGE_SMOKER")}
            </CustomText>
          ),
        }}
      />
      <Stack.Screen
        name="EditExerciseHabit"
        component={EditExerciseHabitScreen}
        options={{
          headerTitle: () => (
            <CustomText style={styles.profileHeaderText}>
              {t("CHANGE_EXERCISEHABIT")}
            </CustomText>
          ),
        }}
      />
      <Stack.Screen
        name="EditPoliticalView"
        component={EditPoliticalViewScreen}
        options={{
          headerTitle: () => (
            <CustomText style={styles.profileHeaderText}>
              {t("CHANGE_POLITICALVIEW")}
            </CustomText>
          ),
        }}
      />
      <Stack.Screen
        name="EditZodiac"
        component={EditZodiacScreen}
        options={{
          headerTitle: () => (
            <CustomText style={styles.profileHeaderText}>
              {t("CHANGE_ZODIAC")}
            </CustomText>
          ),
        }}
      />
      <Stack.Screen
        name="EditRelationshipStyle"
        component={EditRelationshipStyleScreen}
        options={{
          headerTitle: () => (
            <CustomText style={styles.profileHeaderText}>
              {t("CHANGE_RELATIONSHIPSTYLE")}
            </CustomText>
          ),
        }}
      />
      <Stack.Screen
        name="EditInterest"
        component={EditInterestScreen}
        options={{
          headerTitle: () => (
            <CustomText style={styles.profileHeaderText}>
              {t("CHANGE_INTEREST")}
            </CustomText>
          ),
        }}
      />
      <Stack.Screen
        name="EditDreamVacation"
        component={EditDreamVacationScreen}
        options={{
          headerTitle: () => (
            <CustomText style={styles.profileHeaderText}>
              {t("CHANGE_DREAMVACATION")}
            </CustomText>
          ),
        }}
      />
      <Stack.Screen
        name="EditGuiltyPleasure"
        component={EditGuiltyPleasureScreen}
        options={{
          headerTitle: () => (
            <CustomText style={styles.profileHeaderText}>
              {t("CHANGE_GUILTYPLEASURE")}
            </CustomText>
          ),
        }}
      />
      <Stack.Screen
        name="EditCurrentObsession"
        component={EditCurrentObsessionScreen}
        options={{
          headerTitle: () => (
            <CustomText style={styles.profileHeaderText}>
              {t("CHANGE_CURRENTOBSESSION")}
            </CustomText>
          ),
        }}
      />
      <Stack.Screen
        name="EditLastWatched"
        component={EditLastWatchedScreen}
        options={{
          headerTitle: () => (
            <CustomText style={styles.profileHeaderText}>
              {t("CHANGE_LASTWATCHED")}
            </CustomText>
          ),
        }}
      />
      <Stack.Screen
        name="EditWatchingHabit"
        component={EditWatchingHabitScreen}
        options={{
          headerTitle: () => (
            <CustomText style={styles.profileHeaderText}>
              {t("CHANGE_WATCHINGHABIT")}
            </CustomText>
          ),
        }}
      />
      <Stack.Screen
        name="EditDrinkingHabit"
        component={EditDrinkingHabitScreen}
        options={{
          headerTitle: () => (
            <CustomText style={styles.profileHeaderText}>
              {t("CHANGE_DRINKINGHABIT")}
            </CustomText>
          ),
        }}
      />
    </Stack.Navigator>
  );
};

const AppTabs = () => {
  const appUtils = useAppUtils();
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          borderTopColor: "#EFEFF1",
          borderTopWidth: 1,
          paddingTop: 16,
          display: appUtils.bottomTabStyle,
          elevation: 0,
        },
        tabBarLabelStyle: {
          marginTop: 8,
          fontSize: 12,
          fontWeight: "600",
        },
        tabBarActiveTintColor: "#000000",
        tabBarInactiveTintColor: "#A0A1AB",
        headerShown: false,
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
          tabBarLabel: t("EXPLORE"),
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
              <LikesPassive width={24} height={24} color="#A0A1AB" />
            ),
          tabBarLabel: t("LIKES"),
        }}
      />
      <Tab.Screen
        name="Chats"
        component={MessagesStack}
        options={{
          tabBarIcon: ({ focused }) =>
            focused ? (
              <ChatsActive width={24} height={24} />
            ) : (
              <ChatsPassive width={24} height={24} />
            ),
          tabBarLabel: t("CHATS"),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          tabBarIcon: ({ focused }) =>
            focused ? (
              <ProfileActive width={24} height={24} />
            ) : (
              <ProfilePassive
                width={24}
                height={24}
                style={{ color: "#A0A1AB" }}
              />
            ),
          tabBarLabel: t("PROFILE"),
        }}
      />
    </Tab.Navigator>
  );
};

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

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [congifurResponseData, setConfigureResponseData] = useState(null);
  const [appState, setAppState] = useState(AppState.currentState);
  const [lastInactiveTime, setLastInactiveTime] = useState(null);
  const userStore = useUserStore();
  const appUtils = useAppUtils();

  const [fontsLoaded, error] = useFonts({
    "RethinkSans-Regular": require("./src/assets/fonts/RethinkSans-Regular.ttf"),
    "RethinkSans-Medium": require("./src/assets/fonts/RethinkSans-Medium.ttf"),
    "RethinkSans-SemiBold": require("./src/assets/fonts/RethinkSans-SemiBold.ttf"),
    "RethinkSans-Bold": require("./src/assets/fonts/RethinkSans-Bold.ttf"),
    "RethinkSans-ExtraBold": require("./src/assets/fonts/RethinkSans-ExtraBold.ttf"),
  });

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (appState.match(/inactive|background/) && nextAppState === "active") {
        const currentTime = new Date().getTime();
        if (lastInactiveTime && currentTime - lastInactiveTime > 300000) {
          refreshApp();
        }
      }

      if (nextAppState.match(/inactive|background/)) {
        setLastInactiveTime(new Date().getTime());
      }

      setAppState(nextAppState);
    });

    return () => {
      subscription.remove();
    };
  }, [appState, lastInactiveTime]);

  const refreshApp = async () => {
    await Updates.reloadAsync();
  };

  useEffect(() => {
    const setUserLogin = async () => {
      // await SecureStore.deleteItemAsync("refresh_token"); // test amaçlı rekfresh token sıfırlayıcı
      const refreshToken = await SecureStore.getItemAsync("refresh_token");
      // let uuid = await SecureStore.getItemAsync("DEVICE_UUID_KEY");
      // const refreshToken = "5fd59d04-950c-42d3-b854-c78754372457";
      // const refreshToken = null;
      // console.log("tok",userStore.token);

      // function generateUUID() {
      //   return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      //     /[xy]/g,
      //     function (c) {
      //       var r = (Math.random() * 16) | 0,
      //         v = c === "x" ? r : (r & 0x3) | 0x8;
      //       return v.toString(16);
      //     }
      //   );
      // }

      // try {
      //   if (!uuid) {
      //     uuid = generateUUID();
      //     await SecureStore.setItemAsync("DEVICE_UUID_KEY", uuid);
      //   }
      // } catch (error) {
      //   console.error("Error fetching device UUID:", error);
      // }

      if (refreshToken) {
        try {
          const response = await authenticateWithRefreshToken({
            refreshToken: refreshToken,
            deviceUuid: "242141-12432141-213432142",
          });

          if (response.status_en === "expired") {
            await SecureStore.deleteItemAsync("refresh_token");
            userStore.setIsUserLoggedIn(false);
            setAppIsReady(true);
          } else if (response.status_en === "OK") {
            userStore.setToken(response.token);
            await SecureStore.setItemAsync(
              "refresh_token",
              response.refreshToken
            );

            if (response.isConfigured) {
              userStore.setIsUserLoggedIn(true);
              setAppIsReady(true);
            } else {
              const congifurResponse = await checkUserConfiguration();
              setConfigureResponseData(congifurResponse);
              userStore.setIsUserLoggedIn(false);
              setAppIsReady(true);
            }
          } else {
            userStore.setIsUserLoggedIn(false);
            setAppIsReady(true);
          }
        } catch (error) {
          console.log(error);
        }
      } else {
        const timer = setTimeout(() => {
          setAppIsReady(true);
        }, 2000);

        return () => clearTimeout(timer);
      }
    };

    setUserLogin();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <SafeAreaProvider
          style={[
            styles.container,
            { backgroundColor: appUtils.backgroundColor },
          ]}
        >
          <View style={[styles.wrapper]} onLayout={onLayoutRootView}>
            <NavigationContainer
              ref={navigationRef}
              theme={{ colors: { background: "transparent" } }}
              onReady={() =>
                congifurResponseData && checkAndRedirect(congifurResponseData)
              }
            >
              {userStore.isUserLoggedIn ? <AppTabs /> : <AuthStack />}
            </NavigationContainer>
            <StatusBar style="dark" />
          </View>
        </SafeAreaProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

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
  container: {
    flex: 1,
  },
  wrapper: {
    flex: 1,
    paddingVertical: 16,
  },
  profileHeaderText: {
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 24,
    color: "#000000",
  },
});
