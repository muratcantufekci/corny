import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import CornChat from '../../assets/svg/corn-chat.svg'
import CustomText from '../../components/CustomText';
import Button from '../../components/Button';

const OnboardingStartScreen = () => {
  return (
    <View style={styles.container}>
      <View>
        <CornChat style={styles.img}/>
        <CustomText style={styles.text}>Sizin gibi düşünen insanlarla eşleşin!</CustomText>
      </View>
      <Button variant="black" style={styles.button}>Telefonla Devam Et</Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    paddingBottom: 50
  },
  img: {
    marginTop: 60,
  },
  text: {
    fontSize: 26,
    fontWeight: '500',
    lineHeight: 30,
    letterSpacing: -0.03,
    textAlign: 'center',
    paddingHorizontal: 30,
  },
  button: {
    alignSelf: 'flex-end'
  }
});

export default OnboardingStartScreen;
