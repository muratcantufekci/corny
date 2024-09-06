import React, { useRef, useCallback, useState } from "react";
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
  Animated,
  Dimensions,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import * as Haptics from "expo-haptics";
import EpisodeSection from "./EpisodeSection";
import CustomText from "../../../components/CustomText";
import { Audio } from "expo-av";
import Play from "../../../assets/svg/play.svg";
import Like from "../../../assets/svg/likes-passive.svg";
import ImageOpened from "../../../assets/svg/img-opened.svg";
import { getChatroomMessages } from "../../../services/Chat/get-chatroom-messages";
import useChatRoomsStore from "../../../store/useChatRoomsStore";
import { t } from "i18next";

const SWIPE_THRESHOLD = 70;
const SCROLL_THRESHOLD = 10;
const { width } = Dimensions.get("window");

const MessageList = ({
  messages,
  otherUserConnectionId,
  image,
  setPhotoModalVisible,
  setPreviewPhoto,
  setSelectedImage,
  onReply,
  otherUserLastSeen,
  otherUserName,
  chatRoomId,
  setMenuVisible,
  setSelectedMessage,
  likesPressHandler
}) => {
  const locale = navigator.language || "tr-TR";
  const formatter = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    weekday: "short",
  });

  const translateXMap = useRef(new Map()).current;
  const flatListRef = useRef(null);
  const chatRoomsStore = useChatRoomsStore();
  const [loading, setLoading] = useState(false);
  const lastTap = useRef(null);

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

  const openImage = (uri, messageIdentifier, isIncome) => {
    setPhotoModalVisible(true);
    setPreviewPhoto(true);
    setSelectedImage(uri);

    if (chatRoomsStore.connection && isIncome) {
      chatRoomsStore.connection
        .send("OpenImageMessage", otherUserConnectionId, messageIdentifier)
        .then(() => {})
        .catch((error) => console.error("Message sending failed: ", error));
    }
  };

  const getTranslateX = useCallback((key) => {
    if (!translateXMap.has(key)) {
      translateXMap.set(key, new Animated.Value(0));
    }
    return translateXMap.get(key);
  }, []);

  const messageLongPressHandler = (item) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedMessage(item);
    setMenuVisible(true);
  };

  const handleDoubleTap = (item) => {
    const likeMethod =
      item.messageLikes.length === 0 ? "LikeMessage" : "RemoveLike";

    if (chatRoomsStore.connection) {
      chatRoomsStore.connection
        .send(likeMethod, otherUserConnectionId, item.messageIdentifier)
        .then(() => {})
        .catch((error) => console.error("Message sending failed: ", error));
    }
  };

  const handlePress = (item) => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;

    if (lastTap.current && now - lastTap.current < DOUBLE_PRESS_DELAY) {
      handleDoubleTap(item);
    } else {
      lastTap.current = now;
    }
  };

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

      const showSeen =
        !isIncome &&
        new Date(Number(item.ts)) <= new Date(Number(otherUserLastSeen));
      const prevItem = messages[index - 1];
      const prevItemSeen =
        prevItem &&
        new Date(Number(prevItem.ts)) <= new Date(Number(otherUserLastSeen));
      const showSeenIndicator = showSeen && !prevItemSeen;

      return (
        item.messageType !== "statusUpdate" && (
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
              activeOffsetX={isIncome ? [0, 10] : [-10, 0]}
              failOffsetY={[-SCROLL_THRESHOLD, SCROLL_THRESHOLD]}
            >
              <Animated.View
                style={[
                  styles.messageContainer,
                  { transform: [{ translateX }] },
                ]}
              >
                <Pressable
                  style={[
                    styles.messageBox,
                    isIncome ? styles.messageBoxIncome : styles.messageBoxSend,
                  ]}
                  onLongPress={() => messageLongPressHandler(item)}
                  onPress={() => handlePress(item)}
                >
                  {item.messageLikes.length > 0 && (
                    <TouchableOpacity
                      style={[
                        styles.like,
                        isIncome ? { right: -5 } : { left: -5 },
                      ]}
                      onPress={() => likesPressHandler(item)}
                    >
                      <Like width={22} height={22} color="#ff0000" />
                    </TouchableOpacity>
                  )}
                  {item.hasReply && (
                    <View style={styles.replyContainer}>
                      <CustomText style={{ fontWeight: "700" }}>
                        {item.RepliedMessage.sender === otherUserConnectionId
                          ? otherUserName
                          : t("YOU")}
                      </CustomText>
                      {item.RepliedMessage.messageType === "text" && (
                        <CustomText style={{ fontWeight: "500" }}>
                          {item.RepliedMessage.text}
                        </CustomText>
                      )}
                      {item.RepliedMessage.messageType === "image" && (
                        <View style={styles.imgMessage}>
                          <Play width={12} height={12} />
                          <CustomText style={{ fontWeight: "500" }}>
                            {t("PHOTO")}
                          </CustomText>
                        </View>
                      )}
                      {item.RepliedMessage.messageType === "audio" && (
                        <View>
                          <CustomText style={{ fontWeight: "500" }}>
                            Ses Kaydı
                          </CustomText>
                        </View>
                      )}
                    </View>
                  )}
                  {item.messageType === "text" && (
                    <CustomText style={styles.message}>{item.text}</CustomText>
                  )}
                  {item.messageType === "image" && (
                    <TouchableOpacity
                      style={styles.imgMessage}
                      onPress={() =>
                        openImage(
                          item.imageUrl,
                          item.messageIdentifier,
                          isIncome
                        )
                      }
                      disabled={item.isOpened}
                    >
                      {item.isOpened ? (
                        <ImageOpened width={20} height={20} />
                      ) : (
                        <Play width={20} height={20} />
                      )}

                      <CustomText style={{ fontWeight: "600", fontSize: 16 }}>
                        {item.isOpened
                          ? `${t("PHOTO")} ${t("OPENED")}`
                          : t("PHOTO")}
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
                </Pressable>
                <CustomText
                  style={[
                    styles.messageTime,
                    !isIncome && { alignSelf: "flex-end" },
                  ]}
                >
                  {showSeenIndicator ? `${t("SEEN")} - ` : ""}
                  {formattedTime}
                </CustomText>
              </Animated.View>
            </PanGestureHandler>
          </View>
        )
      );
    },
    [messages, otherUserConnectionId, onReply, getTranslateX]
  );

  const loadMoreMessages = async () => {
    setLoading(true);
    const response = await getChatroomMessages(
      chatRoomId,
      messages[messages.length - 1].messageIdentifier
    );
    if (response.isSuccess) {
      chatRoomsStore.setChatRooms(
        chatRoomsStore.chatRooms.map((chatRoom) => {
          if (chatRoom.chatRoomId === response.chatRoomId) {
            return {
              ...chatRoom,
              messages: [...chatRoom.messages, ...response.messages],
            };
          }
          return chatRoom;
        })
      );
      setLoading(false);
    }
  };

  return (
    <FlatList
      ref={flatListRef}
      style={{ flex: 1 }}
      data={messages}
      inverted
      renderItem={renderMessage}
      keyExtractor={(item) => item.messageIdentifier}
      ListFooterComponent={
        <View>
          <EpisodeSection image={image} />
          {loading && <ActivityIndicator />}
        </View>
      }
      onEndReached={loadMoreMessages}
      onEndReachedThreshold={0.5}
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
  like: {
    position: "absolute",
    bottom: -10,
  },
  replyContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    padding: 4,
    paddingHorizontal: 8,
    marginBottom: 4,
    borderRadius: 4,
  },
});

export default MessageList;
