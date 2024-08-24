import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import CustomText from "../../components/CustomText";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import useAppUtils from "../../store/useAppUtils";
import Dots from "../../assets/svg/dots-horizontal.svg";
import Camera from "../../assets/svg/camera.svg";
import Microphone from "../../assets/svg/microphone.svg";
import Plus from "../../assets/svg/plus.svg";
import ArrowUp from "../../assets/svg/arrow-up-circle.svg";
import Input from "../../components/Input";
import Back from "../../assets/svg/arrow-left.svg";
import useChatRoomsStore from "../../store/useChatRoomsStore";
import { t } from "i18next";
import { BottomSheetBackdrop, BottomSheetModal } from "@gorhom/bottom-sheet";
import { postChatImage } from "../../services/send-chat-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { selectImage } from "../../helper/selectImage";

const Header = ({ navigation, userImage, userName, sheetRef, pt }) => (
  <View style={[styles.headerContainer, { paddingTop: pt }]}>
    <View style={styles.headerWrapper}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Back width={30} height={30} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.headerMid}>
        <Image source={{ uri: userImage }} style={styles.headerImg} />
        <View style={styles.headerNameWrap}>
          <CustomText style={styles.headerName}>{userName}</CustomText>
        </View>
      </TouchableOpacity>
    </View>
    <TouchableOpacity onPress={() => sheetRef.current?.present()}>
      <Dots width={32} height={32} />
    </TouchableOpacity>
  </View>
);

const EpisodeSection = ({ image }) => (
  <View style={styles.episode}>
    <Image
      source={require("../../assets/images/noise.png")}
      style={styles.episodeNoise}
    />
    <CustomText style={styles.episodeText}>
      Season 1, Episode 1 - The One who Matt and Lydia matches in Corny!
    </CustomText>
    <View style={styles.episodeImgs}>
      <Image
        source={{ uri: image }}
        style={[styles.episodeImg, styles.episodeFirstImg]}
      />
      <Image
        source={{ uri: image }}
        style={[styles.episodeImg, styles.episodeSecondImg]}
      />
      <Image
        source={require("../../assets/images/beverage.png")}
        style={styles.episodeBeverage}
      />
      <Image
        source={require("../../assets/images/ticket.png")}
        style={styles.episodeTicket}
      />
    </View>
  </View>
);

const MessageList = ({ messages, otherUserConnectionId, image }) => {
  const locale = navigator.language || "tr-TR";
  const formatter = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    weekday: "short",
  });

  return (
    <FlatList
      style={{ flex: 1 }}
      data={messages}
      inverted
      renderItem={({ item, index }) => {
        const isIncome = item.sender === otherUserConnectionId;
        const formattedDate = formatter.format(item.ts);

        const nextItem = messages[index + 1];
        const nextItemDate = nextItem ? formatter.format(nextItem.ts) : null;

        const showDate = formattedDate !== nextItemDate;

        return (
          <>
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
                <Image
                  style={styles.imgMessage}
                  source={{ uri: item.imageUrl }}
                />
              )}
            </View>
            {showDate && (
              <View>
                <CustomText style={styles.messageDate}>
                  {formattedDate}
                </CustomText>
              </View>
            )}
          </>
        );
      }}
      keyExtractor={(item) => item.messageIdentifier}
      ListFooterComponent={<EpisodeSection image={image} />}
    />
  );
};

const ChatHubScreen = ({ route }) => {
  const image =
    "https://media.licdn.com/dms/image/v2/D4D03AQFB0oznJhn_Eg/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1707992142190?e=1729123200&v=beta&t=8WUd5YODbi2dSoWP56kqBzK3Ir47WJQG-xclk_BV0mE";
  const isFocused = useIsFocused();
  const appUtils = useAppUtils();
  const navigation = useNavigation();
  const chatRoomsStore = useChatRoomsStore();
  const { chatRoomId, otherUserConnectionId } = route.params;
  const [message, setMessage] = useState("");
  const sheetRef = useRef(null);
  const snapPoints = useMemo(() => ["27%"], []);
  const insets = useSafeAreaInsets();

  const hubMessages = chatRoomsStore.chatRooms.find(
    (item) => item.chatRoomId === chatRoomId
  );

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        style={{ paddingTop: insets.top }}
        {...props}
      />
    ),
    []
  );

  useEffect(() => {
    if (isFocused) {
      appUtils.setBackgroundColor("#FEFCF5");
      appUtils.setPaddingHorizontal(0);
    }
  }, [isFocused]);

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <Header
          navigation={navigation}
          userImage={image}
          userName={hubMessages.otherUserDisplayName}
          sheetRef={sheetRef}
          pt={insets.top}
        />
      ),
    });
  }, [navigation]);

  const sendMessage = () => {
    if (chatRoomsStore.connection) {
      chatRoomsStore.connection
        .send("SendTextMessage", otherUserConnectionId, message, "111111")
        .then(() => {
          setMessage("");
        })
        .catch((error) => console.error("Message sending failed: ", error));
    } else {
      console.warn("SignalR connection not established.");
    }
  };

  const selectImageHandler = async () => {
    const formData = await selectImage();

    const response = await postChatImage(
      "chatUser_12",
      "chatUser_13",
      formData
    );

    if (response.isSuccess) {
      if (chatRoomsStore.connection) {
        chatRoomsStore.connection
          .send(
            "SendImageMessage",
            otherUserConnectionId,
            response.messageIdentifier,
            " "
          )
          .then(() => {
            setMessage("");
          })
          .catch((error) => console.error("Message sending failed: ", error));
      } else {
        console.warn("SignalR connection not established.");
      }
    }
  };

  return (
    <>
      <KeyboardAvoidingView
        style={{
          flex: 1,
        }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 120 : 0}
      >
        <View
          style={[
            styles.container,
            { paddingBottom: insets.bottom, paddingTop: insets.top },
          ]}
        >
          <View style={styles.messageContainer}>
            <MessageList
              messages={hubMessages.messages}
              otherUserConnectionId={otherUserConnectionId}
              image={image}
            />
          </View>
          <View style={styles.messageSendContainer}>
            <TouchableOpacity style={styles.plusIcon}>
              <Plus />
            </TouchableOpacity>
            <View style={styles.inputWrapper}>
              <Input
                placeholder={t("WRITE_YOUR_MESSAGE")}
                style={styles.input}
                value={message}
                onChangeText={(text) => setMessage(text)}
              />
            </View>
            {message.length > 0 ? (
              <TouchableOpacity onPress={sendMessage}>
                <ArrowUp />
              </TouchableOpacity>
            ) : (
              <>
                <TouchableOpacity onPress={selectImageHandler}>
                  <Camera width={24} height={24} />
                </TouchableOpacity>
                <TouchableOpacity>
                  <Microphone width={24} height={24} />
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
        <BottomSheetModal
          ref={sheetRef}
          snapPoints={snapPoints}
          index={0}
          enablePanDownToClose={true}
          backdropComponent={renderBackdrop}
        >
          <View>
            <TouchableOpacity style={styles.bottomSheetItem}>
              <CustomText style={styles.bottomSheetItemText}>
                {t("UNMATCH")}
              </CustomText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.bottomSheetItem}>
              <CustomText style={styles.bottomSheetItemText}>
                {t("BLOCK")}
              </CustomText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.bottomSheetItem}>
              <CustomText style={styles.bottomSheetItemText}>
                {t("REPORT")}
              </CustomText>
            </TouchableOpacity>
          </View>
        </BottomSheetModal>
      </KeyboardAvoidingView>
    </>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: 24,
  },
  container: {
    padding: 16,
    flex: 1,
    justifyContent: "space-between",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E9E9EC",
    backgroundColor: "#FEFCF5",
    paddingHorizontal: 16,
  },
  headerWrapper: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
    paddingBottom: 10,
  },
  headerMid: {
    flexDirection: "row",
    gap: 8,
  },
  headerImg: {
    width: 40,
    height: 40,
    borderRadius: 999,
  },
  headerNameWrap: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerName: {
    fontWeight: "600",
    fontSize: 18,
    lineHeight: 24,
    color: "#000000",
  },
  messageContainer: {
    flex: 1,
  },
  messageSendContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  messageDate: {
    fontWeight: "400",
    fontSize: 12,
    lineHeight: 16,
    textAlign: "center",
    color: "#51525C",
    marginBottom: 20,
  },
  messageBox: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    maxWidth: "85%",
    marginBottom: 16,
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
    width: 50,
    height: 80,
  },
  plusIcon: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#000000",
    borderRadius: 999,
  },
  inputWrapper: {
    flex: 1,
  },
  input: {
    borderWidth: 1.5,
    borderColor: "#000000",
  },
  episode: {
    backgroundColor: "#FF524F",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 50,
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
    marginBottom: 8,
    overflow: "hidden",
  },
  episodeText: {
    fontWeight: "600",
    fontSize: 16,
    lineHeight: 20,
    color: "#FFFFFF",
    flex: 1,
  },
  episodeImgs: {
    position: "relative",
    width: "40%",
    height: "100%",
    zIndex: 3,
  },
  episodeImg: {
    width: 65,
    height: 75,
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
    borderRadius: 6,
    position: "absolute",
    top: -10,
  },
  episodeFirstImg: {
    right: 70,
    transform: [{ rotate: "-13deg" }],
    zIndex: 3,
  },
  episodeSecondImg: {
    right: 5,
    transform: [{ rotate: "13deg" }],
    zIndex: 2,
  },
  episodeNoise: {
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    opacity: 0.3,
    zIndex: 1,
  },
  episodeBeverage: {
    position: "absolute",
    top: -50,
    right: 35,
    zIndex: 2,
  },
  episodeTicket: {
    position: "absolute",
    top: 28,
    right: 32,
    zIndex: 4,
  },
  bottomSheetItem: {
    alignItems: "center",
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#E9E9EC",
  },
  bottomSheetItemText: {
    fontWeight: "500",
    fontSize: 18,
    lineHeight: 24,
    color: "#000000",
  },
});

export default ChatHubScreen;
