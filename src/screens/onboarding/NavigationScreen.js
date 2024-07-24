import React, { useState, useEffect } from "react";
import { Image, StyleSheet, View, Alert, Platform, Linking, AppState } from "react-native";
import * as Location from "expo-location";
import OnboardingHeading from "../../components/OnboardingHeading";
import Button from "../../components/Button";
import ProggressBar from "../../components/ProggressBar";
import Modal from "../../components/Modal";
import { useNavigation } from "@react-navigation/native";

const NavigationScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [appState, setAppState] = useState(AppState.currentState);
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

  

  const handleButtonPress = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
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
          title="Mükemmel eşleşme hemen yanınızda olabilir."
          desc="Konuma dayalı öneriler almak için lokasyon bilginize erişim izni verin"
          style={styles.textArea}
        />
      </View>
      <Button variant="primary" onPress={handleButtonPress}>İzin Ver</Button>
      <Modal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        img={require("../../assets/images/navigation.png")}
        title="Bağlanılamıyor"
        desc="Corny'yi kullanırken size etrafta kimlerin olduğunu gösterebilmemiz için konum paylaşımını etkinleştirmeniz gerekir."
        btnText="Ayarları Aç"
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
