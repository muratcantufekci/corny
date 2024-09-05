import React, { useEffect, useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import CustomText from "../../components/CustomText";
import { t } from "i18next";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import useAppUtils from "../../store/useAppUtils";
import * as SignalR from "@microsoft/signalr";
import { getChatOverview } from "../../services/Chat/get-chat-overview";
import useChatRoomsStore from "../../store/useChatRoomsStore";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";
import Tabs from "../../components/Tabs";

const ChatsScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const appUtils = useAppUtils();
  const chatRoomsStore = useChatRoomsStore();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (isFocused) {
      appUtils.setBottomTabStyle("flex");
      appUtils.setBackgroundColor("#FFFFFF");
      appUtils.setPaddingHorizontal(16);
    }
  }, [isFocused]);

  useEffect(() => {
    const getChats = async () => {
      const response = await getChatOverview();

      chatRoomsStore.setChatRooms(response.chatRooms);
    };
    getChats();
  }, []);

  useEffect(() => {
    const newConnection = new SignalR.HubConnectionBuilder()
      .withUrl(
        "https://cornyapi.azurewebsites.net/chatHub?username=chatUser_12"
      )
      .withAutomaticReconnect()
      .build();

    chatRoomsStore.setConnection(newConnection);

    return () => {
      if (chatRoomsStore.connection) {
        chatRoomsStore.connection.stop();
      }
    };
  }, []);

  useEffect(() => {
    if (chatRoomsStore.connection) {
      chatRoomsStore.connection
        .start()
        .then(() => {
          console.log("Connected to SignalR!");

          chatRoomsStore.connection.on("ReceiveMessage", (receivedMessage) => {
            console.log("receivedMessage", receivedMessage);

            const parsedMessage = JSON.parse(receivedMessage);

            chatRoomsStore.setChatRooms((prevChatRooms) => {
              const updatedChatRooms = prevChatRooms.map((item) => {
                if(parsedMessage.messageType !== "statusUpdate") {
                  if (
                    item.otherUserConnectionId === parsedMessage.sender ||
                    item.otherUserConnectionId === parsedMessage.receiver
                  ) {
                    return {
                      ...item,
                      messages: [parsedMessage, ...item.messages],
                    };
                  }
                  
                } else {
                  if(parsedMessage.topic === "messageRead") {
                    SecureStore.setItem(item.otherUserConnectionId, Date.now().toString())
                  }
                  if(parsedMessage.topic === "imageOpened") {
                    if (
                      item.otherUserConnectionId === parsedMessage.sender ||
                      item.otherUserConnectionId === parsedMessage.receiver
                    ) {
                      item.messages.map(message => {
                        if(message.messageIdentifier === parsedMessage.messageIdentifier) {
                          message.isOpened = parsedMessage.isOpened
                        }
                      })
                      
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
  }, [chatRoomsStore.connection]);

  const messageBoxPressHandler = (chatRoomId, otherUserConnectionId) => {
    navigation.navigate("MessageHub", {
      chatRoomId,
      otherUserConnectionId,
    });
    appUtils.setBottomTabStyle("none");
  };
  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top,
      }}
    >
      <Tabs tabText={t("MESSAGES")} tabCount={chatRoomsStore.chatRooms?.length}/>
      {chatRoomsStore.chatRooms?.length === 0 ||
      chatRoomsStore.chatRooms === null ? (
        <View style={styles.emptyImageWrapper}>
          <Image source={require("../../assets/images/dialogs.png")} />
          <CustomText style={styles.emptyText}>
            {t("NOTHING_AROUND")}
          </CustomText>
        </View>
      ) : (
        <View>
          {chatRoomsStore.chatRooms?.map((item) => {
            const isIncome = item.messages[0]?.sender === item.otherUserConnectionId;
            const myLastSeen = SecureStore.getItem(`${item.chatRoomId}`) || item.myUserLastReadTs;
            SecureStore.setItem(`${item.chatRoomId}`, myLastSeen)
            return (
              <TouchableOpacity
                key={item.chatRoomId}
                style={styles.messageBox}
                onPress={() =>
                  messageBoxPressHandler(
                    item.chatRoomId,
                    item.otherUserConnectionId,
                  )
                }
              >
                <View style={styles.messageBoxLeft}>
                  <Image
                    source={{
                      uri: "https://media.licdn.com/dms/image/v2/D4D03AQFB0oznJhn_Eg/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1707992142190?e=1729123200&v=beta&t=8WUd5YODbi2dSoWP56kqBzK3Ir47WJQG-xclk_BV0mE",
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
                        (!isIncome
                          ? "Bir resim gönderdiniz"
                          : "Bir resim gönderdi")}
                      {item.messages[0]?.messageType === "audio" &&
                        (!isIncome
                          ? "Bir ses kaydı gönderdiniz"
                          : "Bir ses kaydı gönderdi")}
                    </CustomText>
                  </View>
                </View>
                {isIncome && (new Date(Number(item.messages[0]?.ts)) > new Date(Number(SecureStore.getItem(`${item.chatRoomId}`)))) && (
                  <View style={styles.messageDot}></View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
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
