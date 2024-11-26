import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  Animated,
  Easing,
  SafeAreaView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import useUserStore from "../../store/useUserStore";

const { width, height } = Dimensions.get('window');
const CIRCLE_SIZE = width * 0.8;
const POSTER_SIZE = CIRCLE_SIZE * 0.25;
const IS_SMALL_DEVICE = height < 700;

const WaitlistScreen = () => {
  const userStore = useUserStore();

  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  
  const registeredCount = userStore.waitListCounter;
  const targetCount = userStore.waitListTarget;
  const remainingSpots = targetCount - registeredCount;
  const progress = (registeredCount / targetCount) * 100;

  const posters = [
    { id: '1', title: 'Stranger Things', position: 0,uri:"https://cornystorage.blob.core.windows.net/tvshowposters/1_1723289470442_poster.jpg" },
    { id: '2', title: 'Breaking Bad', position: 72,uri:"https://cornystorage.blob.core.windows.net/tvshowposters/2_1723289476362_poster.jpg" },
    { id: '3', title: 'Game of Thrones', position: 144,uri:"https://cornystorage.blob.core.windows.net/tvshowposters/3_1723289477486_poster.jpg" },
    { id: '4', title: 'The Crown', position: 216,uri:  "https://cornystorage.blob.core.windows.net/tvshowposters/4_1723289478716_poster.jpg" },
    { id: '5', title: 'Friends', position: 288,uri:"https://cornystorage.blob.core.windows.net/tvshowposters/5_1723289479882_poster.jpg" },
  ];

  useEffect(() => {
    const rotationAnimation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 15000,
        easing: Easing.linear,
        useNativeDriver: true,
        isInteraction: false,
      }),
      { iterations: -1 }
    );

    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.05,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    );

    rotationAnimation.start();
    pulseAnimation.start();

    return () => {
      rotationAnimation.stop();
      pulseAnimation.stop();
    };
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
    extrapolate: 'extend'
  });

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={['#FF524F', '#FFE6E5']}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Spoiler Alert</Text>
          <Text style={[styles.subtitle, { color: '#ffffff' }]}>
          Dizi ve Film zevkine göre eşleşmelerin olduğu bu özel deneyim için hazırlıklarımız devam ediyor.
          </Text>
        </View>

        <View style={styles.circleContainer}>
          <Animated.View
            style={[
              styles.rotatingCircle,
              { transform: [{ rotate: spin }] },
            ]}
          >
            {posters.map((poster, index) => {
              const posterRotation = -poster.position;
              const angleRad = (poster.position * Math.PI) / 180;
              const x = Math.cos(angleRad) * (CIRCLE_SIZE * 0.35);
              const y = Math.sin(angleRad) * (CIRCLE_SIZE * 0.35);

              return (
                <Animated.View
                  key={poster.id}
                  style={[
                    styles.posterContainer,
                    {
                      transform: [
                        { translateX: x },
                        { translateY: y },
                        { rotate: `${posterRotation}deg` },
                      ],
                    },
                  ]}
                >
                  <Image
                    source={{ uri: poster.uri }}
                    style={styles.poster}
                  />
                </Animated.View>
              );
            })}
          </Animated.View>

          <Animated.View
            style={[
              styles.centerStats,
              { transform: [{ scale: scaleAnim }] },
            ]}
          >
            <Text style={styles.countText}>{registeredCount}</Text>
            <Text style={styles.statsText}>Kişi Kayıtlı</Text>
          </Animated.View>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBg}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>%{Math.round(progress)} Doluluk</Text>
        </View>

        <View style={styles.statusContainer}>
          <Text style={styles.statusTitle}>Hazırlıklar Devam Ediyor!</Text>
          <Text style={styles.statusDescription}>
            Dizi ve film eşleşmelerin için sabırsızlanıyoruz. Çok yakında seninleyiz!
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: IS_SMALL_DEVICE ? 25: 50,
    marginBottom: IS_SMALL_DEVICE ? 10 : 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
  },
  circleContainer: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: IS_SMALL_DEVICE ? height * 0.02 : height * 0.05,
  },
  rotatingCircle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    borderWidth: 2,
    borderColor: 'rgba(255, 82, 79, 0.3)',
    position: 'absolute',
  },
  posterContainer: {
    position: 'absolute',
    width: POSTER_SIZE,
    height: POSTER_SIZE * 1.5,
    left: CIRCLE_SIZE / 2 - POSTER_SIZE / 2,
    top: CIRCLE_SIZE / 2 - (POSTER_SIZE * 1.5) / 2,
  },
  poster: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    backgroundColor: '#FF524F',
  },
  centerStats: {
    backgroundColor: 'rgba(255, 82, 79, 0.8)',
    borderRadius: IS_SMALL_DEVICE ? 60 : 75,
    width: IS_SMALL_DEVICE ? 120 : 150,
    height: IS_SMALL_DEVICE ? 120 : 150,
    justifyContent: 'center',
    alignItems: 'center',
    padding: IS_SMALL_DEVICE ? 12 : 15,
  },
  countText: {
    fontSize: IS_SMALL_DEVICE ? 28 : 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: IS_SMALL_DEVICE ? 3 : 5,
  },
  statsText: {
    fontSize: IS_SMALL_DEVICE ? 12 : 14,
    color: '#FFE6E5',
    textAlign: 'center',
  },
  remainingText: {
    fontSize: IS_SMALL_DEVICE ? 10 : 12,
    color: '#FFE6E5',
    marginTop: IS_SMALL_DEVICE ? 3 : 5,
  },
  progressContainer: {
    marginTop: IS_SMALL_DEVICE ? 10 : 20,
    paddingHorizontal: 20,
    position: 'relative',
    top: IS_SMALL_DEVICE ? -height * 0.05 : 0,
  },
  progressBg: {
    height: 8,
    backgroundColor: 'rgba(255, 82, 79, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF524F',
    borderRadius: 4,
  },
  progressText: {
    color: '#FF524F',
    textAlign: 'center',
    marginTop: 8,
    fontSize: 14,
  },
  statusContainer: {
    borderRadius: 12,
    padding: IS_SMALL_DEVICE ? 12 : 15,
    marginTop: IS_SMALL_DEVICE ? 10 : 15,
    position: 'relative',
    top: IS_SMALL_DEVICE ? -height * 0.05 : 0,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  statusDescription: {
    fontSize: 13,
    color: '#FF524F',
    lineHeight: 18,
  },
});

export default WaitlistScreen;