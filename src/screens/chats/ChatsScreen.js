import React, { useCallback, useEffect, useState } from "react";
import {
  AppState,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import CustomText from "../../components/CustomText";
import { t } from "i18next";
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from "@react-navigation/native";
import useAppUtils from "../../store/useAppUtils";
import * as SignalR from "@microsoft/signalr";
import { getChatOverview } from "../../services/Chat/get-chat-overview";
import useChatRoomsStore from "../../store/useChatRoomsStore";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";
import Tabs from "../../components/Tabs";
import { getDeviceInfo } from "../../helper/getDeviceInfo";
import { postMarketingEvents } from "../../services/Event/send-marketing-event";

const ChatsScreen = ({ route }) => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const appUtils = useAppUtils();
  const chatRoomsStore = useChatRoomsStore();
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);

  const TABS_DATA = [
    {
      index: 0,
      name: t("MESSAGES"),
      count: chatRoomsStore.chatRooms?.length,
    },
  ];

  const getChats = async () => {
    const response = await getChatOverview();

    chatRoomsStore.setChatRooms(response.chatRooms.reverse());
    chatRoomsStore.setMyChatUser(response.myChatUser);
  };

  useEffect(() => {
    if (isFocused) {
      getChats();
      appUtils.setBottomTabStyle("flex");
      appUtils.setBackgroundColor("#FFFFFF");
      appUtils.setPaddingHorizontal(16);
    }
  }, [isFocused]);

  useEffect(() => {
    const postViewContent = async () => {
      const deviceInfo = await getDeviceInfo();
      const viewContentData = {
        deviceInfo,
        eventType: "ViewContent",
        eventData: ["chat"],
        fbc: "",
      };
      const viewContentRespone = await postMarketingEvents(viewContentData);
    };
    postViewContent();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (route.params?.refresh) {
        const fetchChats = async () => {
          await getChats();
        };

        fetchChats();
        navigation.setParams({ refresh: undefined });
      }
    }, [route.params?.refresh])
  );

  useEffect(() => {
    if (chatRoomsStore.myChatUser) {
      const newConnection = new SignalR.HubConnectionBuilder()
        .withUrl(
          `https://cornyapi.azurewebsites.net/chatHub?username=${chatRoomsStore.myChatUser.myConnectionId}`
        )
        .withAutomaticReconnect()
        .build();

      chatRoomsStore.setConnection(newConnection);

      return () => {
        if (chatRoomsStore.connection) {
          chatRoomsStore.connection.stop();
        }
      };
    }
  }, [chatRoomsStore.myChatUser]);

  useEffect(() => {
    let pingInterval = null;
    const appStateSubscription = AppState.addEventListener(
      "change",
      (nextAppState) => {
        if (nextAppState === "active") {
          // App came to foreground - start ping
          startPing();
        } else {
          // App went to background - stop ping
          if (pingInterval) {
            clearInterval(pingInterval);
            pingInterval = null;
          }
        }
      }
    );

    const startPing = () => {
      if (pingInterval) {
        clearInterval(pingInterval);
      }

      pingInterval = setInterval(() => {
        if (chatRoomsStore.connection?.state === "Connected") {
          if (chatRoomsStore.connection) {
            chatRoomsStore.connection
              .send("Ping")
              .catch((error) =>
                console.error("Message sending failed: ", error)
              );
          } else {
            console.warn("SignalR connection not established.");
          }
        }
      }, 5000);
    };

    if (chatRoomsStore.connection) {
      chatRoomsStore.connection
        .start()
        .then(() => {
          console.log("Connected to SignalR!");

          // Start ping when connection is established
          startPing();

          chatRoomsStore.connection.on("ReceiveMessage", (receivedMessage) => {
            console.log("receivedMessage", receivedMessage);

            const parsedMessage = JSON.parse(receivedMessage);

            chatRoomsStore.setChatRooms((prevChatRooms) => {
              const updatedChatRooms = prevChatRooms.map((item) => {
                const isInHub =
                  item.otherUserConnectionId === parsedMessage.sender ||
                  item.otherUserConnectionId === parsedMessage.receiver;

                if (parsedMessage.messageType !== "statusUpdate") {
                  if (isInHub) {
                    return {
                      ...item,
                      messages: [parsedMessage, ...item.messages],
                    };
                  }
                } else {
                  if (parsedMessage.topic === "messageRead") {
                    SecureStore.setItem(
                      item.otherUserConnectionId,
                      Date.now().toString()
                    );
                  }
                  if (parsedMessage.topic === "imageOpened") {
                    if (isInHub) {
                      item.messages.map((message) => {
                        if (
                          message.messageIdentifier ===
                          parsedMessage.messageIdentifier
                        ) {
                          message.isOpened = parsedMessage.isOpened;
                        }
                      });
                    }
                  }
                  if (parsedMessage.topic === "messageLiked") {
                    if (isInHub) {
                      const updatedMessages = item.messages.map((message) => {
                        if (
                          message.messageIdentifier ===
                          parsedMessage.messageIdentifier
                        ) {
                          return {
                            ...message,
                            messageLikes: [
                              ...message.messageLikes,
                              parsedMessage.sender,
                            ],
                          };
                        }
                        return message;
                      });
                      return {
                        ...item,
                        messages: updatedMessages,
                      };
                    }
                  }

                  if (parsedMessage.topic === "messageLikeRemoved") {
                    if (isInHub) {
                      const updatedMessages = item.messages.map((message) => {
                        if (
                          message.messageIdentifier ===
                          parsedMessage.messageIdentifier
                        ) {
                          return {
                            ...message,
                            messageLikes: message.messageLikes.filter(
                              (like) => like !== parsedMessage.sender
                            ),
                          };
                        }
                        return message;
                      });
                      return {
                        ...item,
                        messages: updatedMessages,
                      };
                    }
                  }
                }
                return item;
              });

              return updatedChatRooms;
            });
          });
        })
        .catch((error) => console.error("Connection failed: ", error));
    }

    // Cleanup function
    return () => {
      if (pingInterval) {
        clearInterval(pingInterval);
      }
      appStateSubscription.remove();
    };
  }, [chatRoomsStore.connection]);

  const messageBoxPressHandler = (
    chatRoomId,
    otherUserConnectionId,
    otherUserId,
    otherUserImg
  ) => {
    navigation.navigate("MessageHub", {
      chatRoomId,
      otherUserConnectionId,
      otherUserId,
      otherUserImg,
    });
    appUtils.setBottomTabStyle("none");
  };

  const onRefresh = () => {
    setRefreshing(true);
    getChats();
    setRefreshing(false);
  };

  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top + 16,
        paddingHorizontal: 16,
      }}
    >
      <Tabs tabsData={TABS_DATA} />
      {chatRoomsStore.chatRooms?.length === 0 ||
      chatRoomsStore.chatRooms === null ? (
        <View style={styles.emptyImageWrapper}>
          <Image source={require("../../assets/images/dialogs.png")} />
          <CustomText style={styles.emptyText}>
            {t("NOTHING_AROUND")}
          </CustomText>
        </View>
      ) : (
        <FlatList
          data={chatRoomsStore.chatRooms}
          keyExtractor={(item) => item.chatRoomId.toString()}
          refreshing={refreshing}
          onRefresh={onRefresh}
          renderItem={({ item }) => {
            const isIncome =
              item.messages[0]?.sender === item.otherUserConnectionId;
            const myLastSeen =
              SecureStore.getItem(`${item.chatRoomId}`) ||
              item.myUserLastReadTs;
            SecureStore.setItem(`${item.chatRoomId}`, myLastSeen);

            return (
              <TouchableOpacity
                style={styles.messageBox}
                onPress={() =>
                  messageBoxPressHandler(
                    item.chatRoomId,
                    item.otherUserConnectionId,
                    item.otherUserId,
                    item.otherUserProfileImage.imageUrl
                  )
                }
              >
                <View style={styles.messageBoxLeft}>
                  <Image
                    source={{
                      uri: item.otherUserProfileImage.imageUrl,
                    }}
                    style={styles.messageImg}
                  />
                  <View>
                    <CustomText style={styles.messageName}>
                      {item.otherUserDisplayName}
                    </CustomText>
                    <CustomText style={styles.message}>
                      {item.messages[0]?.messageType === "text" &&
                        item.messages[0]?.text}
                      {item.messages[0]?.messageType === "image" &&
                        (!isIncome ? t("SEND_IMAGE") : t("INCOME_IMAGE"))}
                      {item.messages[0]?.messageType === "audio" &&
                        (!isIncome ? t("SEND_AUDIO") : t("INCOME_AUDIO"))}
                      {item.messages[0]?.messageType === "tvShowShare" &&
                        (!isIncome ? t("SEND_MOVIE") : t("INCOME_MOVIE"))}
                    </CustomText>
                  </View>
                </View>
                {isIncome &&
                  new Date(Number(item.messages[0]?.ts)) >
                    new Date(
                      Number(SecureStore.getItem(`${item.chatRoomId}`))
                    ) && <View style={styles.messageDot}></View>}
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  emptyImageWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontWeight: "500",
    fontSize: 16,
    lineHeight: 24,
    color: "#ACACAC",
    marginTop: 8,
  },
  messageBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#0000001A",
  },
  messageBoxLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
  },
  messageImg: {
    width: 56,
    height: 56,
    borderRadius: 999,
  },
  messageName: {
    fontWeight: "600",
    fontSize: 16,
    lineHeight: 24,
    color: "#000000",
  },
  messageDot: {
    width: 10,
    height: 10,
    backgroundColor: "#FF524F",
    borderRadius: 999,
  },
  message: {
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 24,
    color: "#000000",
  },
});

export default ChatsScreen;
