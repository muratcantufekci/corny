import React, { useRef, useCallback } from "react";
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
  Animated,
  Dimensions,
} from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import * as Haptics from 'expo-haptics'; // Expo Haptics'i içe aktarın
import EpisodeSection from "./EpisodeSection";
import CustomText from "../../../components/CustomText";
import { Audio } from "expo-av";
import Play from "../../../assets/svg/play.svg";

const SWIPE_THRESHOLD = 70;
const SCROLL_THRESHOLD = 10; // Dikey kaydırma için eşik değer
const { width } = Dimensions.get("window");

const MessageList = ({
  messages,
  otherUserConnectionId,
  image,
  setPhotoModalVisible,
  setPreviewPhoto,
  setSelectedImage,
  onReply,
}) => {
  const locale = navigator.language || "tr-TR";
  const formatter = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    weekday: "short",
  });

  const translateXMap = useRef(new Map()).current;
  const flatListRef = useRef(null);

  const formatTimestampToTime = (timestamp) => {
    const date = new Date(Number(timestamp));
    return date.toLocaleTimeString("default", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const setupAudio = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
    } catch (error) {
      console.error("Error setting up audio mode:", error);
    }
  };

  const playSound = async (uri) => {
    try {
      await setupAudio();

      const { sound } = await Audio.Sound.createAsync({ uri });

      await sound.playAsync();
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  };

  const openImage = (uri) => {
    setPhotoModalVisible(true);
    setPreviewPhoto(true);
    setSelectedImage(uri);
  };

  const getTranslateX = useCallback((key) => {
    if (!translateXMap.has(key)) {
      translateXMap.set(key, new Animated.Value(0));
    }
    return translateXMap.get(key);
  }, []);

  const renderMessage = useCallback(
    ({ item, index }) => {
      const isIncome = item.sender === otherUserConnectionId;
      const formattedDate = formatter.format(item.ts);
      const formattedTime = formatTimestampToTime(item.ts);

      const nextItem = messages[index + 1];
      const nextItemDate = nextItem ? formatter.format(nextItem.ts) : null;

      const showDate = formattedDate !== nextItemDate;

      const translateX = getTranslateX(item.messageIdentifier);

      const onHandlerStateChange = (event) => {
        if (event.nativeEvent.oldState === State.ACTIVE) {
          const dragX = event.nativeEvent.translationX;
          let toValue = 0;
      
          if (isIncome && dragX > SWIPE_THRESHOLD) {
            toValue = SWIPE_THRESHOLD;
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
            onReply(item);
            toValue = 0;
          } else if (!isIncome && dragX < -SWIPE_THRESHOLD) {
            toValue = -SWIPE_THRESHOLD;
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            onReply(item);
            toValue = 0;
          }
      
          Animated.spring(translateX, {
            toValue,
            bounciness: false,
            speed: 10, 
            useNativeDriver: true,
          }).start();
        }
      };
      
      const handleGestureEvent = (event) => {
        const { translationX } = event.nativeEvent;

        const maxTranslateX = width / 2;
        const minTranslateX = -width / 2;

        // Mesaj bana geldiyse, sağa kaydırmaya izin ver, sola kaydırmayı engelle
        if (isIncome) {
          translateX.setValue(
            Math.min(Math.max(translationX, 0), maxTranslateX)
          );
        } else {
          // Mesaj benden gittiyse, sola kaydırmaya izin ver, sağa kaydırmayı engelle
          translateX.setValue(
            Math.max(Math.min(translationX, 0), minTranslateX)
          );
        }
      };

      return (
        <View>
          {showDate && (
            <View>
              <CustomText style={styles.messageDate}>
                {formattedDate}
              </CustomText>
            </View>
          )}
          <PanGestureHandler
            onGestureEvent={handleGestureEvent}
            onHandlerStateChange={onHandlerStateChange}
            activeOffsetX={isIncome ? [0, 10] : [-10, 0]} // Yalnızca izin verilen yöne kaydırılabilir
            failOffsetY={[-SCROLL_THRESHOLD, SCROLL_THRESHOLD]} // Dikey hareket için başarısızlık eşiği
          >
            <Animated.View
              style={[
                styles.messageContainer,
                { transform: [{ translateX }] },
                isIncome
                  ? styles.messageContainerIncome
                  : styles.messageContainerSend,
              ]}
            >
              <View
                style={[
                  styles.messageBox,
                  isIncome ? styles.messageBoxIncome : styles.messageBoxSend,
                ]}
              >
                {item.messageType === "text" && (
                  <CustomText style={styles.message}>{item.text}</CustomText>
                )}
                {item.messageType === "image" && (
                  <TouchableOpacity
                    style={styles.imgMessage}
                    onPress={() => openImage(item.imageUrl)}
                  >
                    <Play width={20} height={20} />
                    <CustomText style={{ fontWeight: "600", fontSize: 16 }}>
                      Fotoğraf
                    </CustomText>
                  </TouchableOpacity>
                )}
                {item.messageType === "audio" && (
                  <TouchableOpacity onPress={() => playSound(item.audioUrl)}>
                    <CustomText style={{ fontWeight: "600", fontSize: 14 }}>
                      Ses Kaydını Oynat
                    </CustomText>
                  </TouchableOpacity>
                )}
              </View>
              <CustomText
                style={[
                  styles.messageTime,
                  !isIncome && { alignSelf: "flex-end" },
                ]}
              >
                {formattedTime}
              </CustomText>
            </Animated.View>
          </PanGestureHandler>
        </View>
      );
    },
    [messages, otherUserConnectionId, onReply, getTranslateX]
  );

  return (
    <FlatList
      ref={flatListRef}
      style={{ flex: 1 }}
      data={messages}
      inverted
      renderItem={renderMessage}
      keyExtractor={(item) => item.messageIdentifier}
      ListFooterComponent={<EpisodeSection image={image} />}
    />
  );
};

const styles = StyleSheet.create({
  messageDate: {
    fontWeight: "400",
    fontSize: 12,
    lineHeight: 16,
    textAlign: "center",
    color: "#51525C",
    marginBottom: 20,
  },
  messageTime: {
    fontWeight: "400",
    fontSize: 12,
    lineHeight: 16,
    color: "#51525C",
    marginBottom: 16,
  },
  messageBox: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    maxWidth: "85%",
    marginBottom: 8,
  },
  messageBoxIncome: {
    backgroundColor: "#FCE89E",
    alignSelf: "flex-start",
  },
  messageBoxSend: {
    backgroundColor: "#E5E3FF",
    alignSelf: "flex-end",
  },
  message: {
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 24,
    color: "#000000",
  },
  imgMessage: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});

export default MessageList;
