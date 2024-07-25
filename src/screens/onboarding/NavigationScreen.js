import React, { useState, useEffect } from "react";
import { Image, StyleSheet, View, Alert, Platform, Linking, AppState } from "react-native";
import * as Location from "expo-location";
import OnboardingHeading from "../../components/OnboardingHeading";
import Button from "../../components/Button";
import ProggressBar from "../../components/ProggressBar";
import Modal from "../../components/Modal";
import { useNavigation } from "@react-navigation/native";
import { t } from "i18next";

const NavigationScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [appState, setAppState] = useState(AppState.currentState);
  const [location, setLocation] = useState(null);
  const [city, setCity] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      let response = await Location.hasServicesEnabledAsync();
      setModalVisible(!response);
    })(); 
  }, []);

  useEffect(() => {
    const handleAppStateChange = async (nextAppState) => {
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        let response = await Location.hasServicesEnabledAsync();
        setModalVisible(!response);
      } 
      setAppState(nextAppState);
    };
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, [appState])

  useEffect(() => {
    if (location) {
      (async () => {
        let reverseGeocode = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        if (reverseGeocode.length > 0) {
          // console.log('city',reverseGeocode); // istek atılacağı zaman bakıcam
          setCity(reverseGeocode[0].city);
        }
      })();
    }
  }, [location]);

  

  const handleButtonPress = async () => {
    let response = await Location.requestForegroundPermissionsAsync();
    
    if (response.status === 'granted') {
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      navigation.navigate("Name");
    } else {
      Alert.alert(
        "İzin verilmedi",
        "Konum izni gerekli",
        [
          { text: "İptal", style: "cancel" },
          { text: "Ayarlar", onPress: () => openSettings() }
        ]
      );
    }
  };

  const openSettings = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:');
    } else {
      Linking.openSettings();
    }
  };

  const modalBtnClickHandler = () => {
    Linking.openSettings();
  }

  return (
    <View style={styles.container}>
      <View>
        <ProggressBar step={1} />
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
      <Button variant="primary" onPress={handleButtonPress}>{t("ALLOW_PERMISSION")}</Button>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingBottom: 50,
  },
  img: {
    width: "100%",
    height: 312,
    objectFit: "contain",
    marginBottom: 40,
  },
  textArea: {
    marginBottom: 24,
  },
});

export default NavigationScreen;
