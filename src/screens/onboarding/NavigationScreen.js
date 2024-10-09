import React, { useState, useEffect } from "react";
import {
  Image,
  StyleSheet,
  View,
  Alert,
  Platform,
  Linking,
  AppState,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import * as Location from "expo-location";
import OnboardingHeading from "../../components/OnboardingHeading";
import Button from "../../components/Button";
import ProggressBar from "../../components/ProggressBar";
import Modal from "../../components/Modal";
import { useNavigation } from "@react-navigation/native";
import { t } from "i18next";
import { postUserLocation } from "../../services/User/send-location";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const NavigationScreen = ({ route }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [appState, setAppState] = useState(AppState.currentState);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (route.params?.disableBack) {
      navigation.setOptions({
        headerLeft: () => null,
      });
    }
  }, [navigation, route.params?.disableBack]);

  useEffect(() => {
    (async () => {
      let response = await Location.hasServicesEnabledAsync();
      setModalVisible(!response);
    })();
  }, []);

  useEffect(() => {
    const handleAppStateChange = async (nextAppState) => {
      if (appState.match(/inactive|background/) && nextAppState === "active") {
        let response = await Location.hasServicesEnabledAsync();
        setModalVisible(!response);
      }
      setAppState(nextAppState);
    };
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );
    return () => subscription.remove();
  }, [appState]);

  useEffect(() => {
    if (location) {
      (async () => {
        let reverseGeocode = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        if (reverseGeocode.length > 0) {
          const data = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            city: reverseGeocode[0].city,
            isoCountryCode: reverseGeocode[0].isoCountryCode,
          };
          try {
            const res = await postUserLocation(data);
            if (res.isSuccess) {
              navigation.navigate("Name");
            }
          } catch (error) {
            console.error(error);
          }
        }
        setLoading(false);
      })();
    }
  }, [location]);

  const handleButtonPress = async () => {
    setLoading(true);
    let response = await Location.requestForegroundPermissionsAsync();

    if (response.status === "granted") {
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    } else {
      Alert.alert("İzin verilmedi", "Konum izni gerekli", [
        { text: "İptal", style: "cancel" },
        { text: "Ayarlar", onPress: () => openSettings() },
      ]);
    }
    setLoading(false);
  };

  const openSettings = () => {
    if (Platform.OS === "ios") {
      Linking.openURL("app-settings:");
    } else {
      Linking.openSettings();
    }
  };

  const modalBtnClickHandler = () => {
    Linking.openSettings();
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: insets.bottom,
        },
      ]}
    >
      <View>
        <ProggressBar step={1} totalStep={7}/>
        <Image
          source={require("../../assets/images/navigation.png")}
          style={styles.img}
        />
        <OnboardingHeading
          title={t("NAVIGATION_SCREEN_TITLE")}
          desc={t("NAVIGATION_SCREEN_DESC")}
          style={styles.textArea}
        />
      </View>
      <Button
        variant={loading ? "disable" : "primary"}
        disabled={loading}
        loader={loading && <ActivityIndicator />}
        onPress={handleButtonPress}
      >
        {t("ALLOW_PERMISSION")}
      </Button>
      <Modal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        img={require("../../assets/images/navigation.png")}
        title={t("UNABLE_TO_CONNECT")}
        desc={t("UNABLE_TO_CONNECT_DESC")}
        btnText={t("OPEN_SETTINGS")}
        btnVariant="primary"
        btnClickFunc={modalBtnClickHandler}
      />
    </View>
  );
};

const imgHeight = Dimensions.get("window").height / 2.7;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 16
  },
  img: {
    width: "100%",
    height: imgHeight,
    objectFit: "contain",
    marginBottom: 40,
  },
  textArea: {
    marginBottom: 24,
  },
});

export default NavigationScreen;
