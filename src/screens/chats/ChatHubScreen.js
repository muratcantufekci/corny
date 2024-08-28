import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
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
import Camera from "../../assets/svg/camera.svg";
import Microphone from "../../assets/svg/microphone.svg";
import Plus from "../../assets/svg/plus.svg";
import ArrowUp from "../../assets/svg/arrow-up-circle.svg";
import Input from "../../components/Input";
import Photos from "../../assets/svg/photos.svg";
import Gifs from "../../assets/svg/gifs.svg";
import Suggest from "../../assets/svg/suggest.svg";
import Quiz from "../../assets/svg/quiz.svg";
import Cross from "../../assets/svg/cross.svg";
import useChatRoomsStore from "../../store/useChatRoomsStore";
import { t } from "i18next";
import { BottomSheetBackdrop, BottomSheetModal } from "@gorhom/bottom-sheet";
import { postChatImage } from "../../services/send-chat-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { selectImage, uriToFile } from "../../helper/selectImage";
import { BlurView } from "expo-blur";
import Button from "../../components/Button";
import * as ImagePicker from "expo-image-picker";
import { Audio } from "expo-av";
import { postChatAudio } from "../../services/send-chat-audio";
import ChatHubHeader from "./components/ChatHubHeader";
import MessageList from "./components/MessageList";
import * as SecureStore from "expo-secure-store";

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
  const [menuModalVisible, setMenuModalVisible] = useState(false);
  const [photoModalVisible, setPhotoModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageFormData, setImageFormData] = useState(null);
  const [recording, setRecording] = useState(null);
  const [previewPhoto, setPreviewPhoto] = useState(false);
  const [replyMessage, setReplyMessage] = useState(null);

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
      SecureStore.setItem(otherUserConnectionId,Date.now().toString())
    }
  }, [isFocused]);

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <ChatHubHeader
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
    const data = await selectImage();
    setMenuModalVisible(false);
    setSelectedImage(data.uri);
    setPhotoModalVisible(true);
    setPreviewPhoto(false);
    setImageFormData(data.formData);
  };

  const sendImageHandler = async (formData) => {
    const response = await postChatImage(
      "chatUser_12",
      otherUserConnectionId,
      formData
    );

    if (response.isSuccess) {
      setPhotoModalVisible(false);
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

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access camera is required!");
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      const file = await uriToFile(uri);
      const formData = new FormData();
      formData.append("image", {
        uri: file.uri,
        type: file.type,
        name: file.name,
      });

      setSelectedImage(uri);
      setImageFormData(formData);
      setPhotoModalVisible(true);
    }
  };

  const startRecording = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { status } = await Audio.requestPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission to access microphone was denied");
        return;
      }

      const { recording } = await Audio.Recording.createAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      setRecording(recording);
    } catch (error) {
      console.error("Failed to start recording", error);
    }
  };

  const stopRecording = async () => {
    try {
      if (recording) {
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();

        const file = await uriToFile(uri);

        const formData = new FormData();
        formData.append("audio", file);

        const response = await postChatAudio(
          "chatUser_12",
          otherUserConnectionId,
          formData
        );

        if (response.isSuccess) {
          if (chatRoomsStore.connection) {
            chatRoomsStore.connection
              .send(
                "SendAudioMessage",
                otherUserConnectionId,
                response.messageIdentifier,
                " "
              )
              .then(() => {
                setMessage("");
              })
              .catch((error) =>
                console.error("Message sending failed: ", error)
              );
          } else {
            console.warn("SignalR connection not established.");
          }
        }

        setRecording(null);
      }
    } catch (error) {
      console.error("Failed to stop recording", error);
    }
  };

  const onReply = (item) => {
    let message;
    if (item.messageType === "text") {
      message = item.text;
    } else if (item.messageType === "image") {
      message = t("PHOTO");
    } else {
      message = t("AUDIO");
    }
    setReplyMessage({
      message,
      replyColor: otherUserConnectionId === item.sender ? "#FCE89E" : "#E5E3FF",
    });
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
        <View style={[styles.container, { paddingBottom: insets.bottom }]}>
          <View style={styles.messageContainer}>
            <MessageList
              messages={hubMessages.messages}
              otherUserConnectionId={otherUserConnectionId}
              image={image}
              setPhotoModalVisible={setPhotoModalVisible}
              setPreviewPhoto={setPreviewPhoto}
              setSelectedImage={setSelectedImage}
              onReply={onReply}
            />
          </View>
          {replyMessage && (
            <View style={styles.messageReplyContainer}>
              <View
                style={[
                  styles.messageReplyText,
                  { borderLeftColor: replyMessage?.replyColor },
                ]}
              >
                <CustomText style={styles.messageReplyName}>
                  {hubMessages.otherUserDisplayName}
                </CustomText>
                <CustomText style={styles.messageReplyContent}>
                  {replyMessage?.message}
                </CustomText>
              </View>
              <TouchableOpacity style={styles.messageReplyIcon} onPress={() => setReplyMessage(null)}>
                <Cross />
              </TouchableOpacity>
            </View>
          )}
          <View style={styles.messageSendContainer}>
            <TouchableOpacity
              style={styles.plusIcon}
              onPress={() => setMenuModalVisible(true)}
            >
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
                <TouchableOpacity onPress={takePhoto}>
                  <Camera width={24} height={24} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPressIn={startRecording}
                  onPressOut={stopRecording}
                >
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
      <Modal transparent={true} visible={menuModalVisible} animationType="fade">
        <TouchableWithoutFeedback onPress={() => setMenuModalVisible(false)}>
          <BlurView intensity={50} style={StyleSheet.absoluteFill}>
            <View style={styles.messageMenu}>
              <TouchableOpacity
                style={styles.messageMenuItem}
                onPress={selectImageHandler}
              >
                <Photos width={24} height={24} />
                <CustomText style={styles.messageMenuItemText}>
                  {t("PHOTOS")}
                </CustomText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.messageMenuItem}>
                <Gifs width={24} height={24} />
                <CustomText style={styles.messageMenuItemText}>
                  {t("GIFS")}
                </CustomText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.messageMenuItem}>
                <Suggest width={24} height={24} />
                <CustomText style={styles.messageMenuItemText}>
                  {t("SUGGEST_TV_SERIES")}
                </CustomText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.messageMenuItem}>
                <Quiz width={24} height={24} />
                <CustomText style={styles.messageMenuItemText}>
                  {t("INVITE_QUIZ")}
                </CustomText>
              </TouchableOpacity>
            </View>
          </BlurView>
        </TouchableWithoutFeedback>
      </Modal>
      <Modal
        transparent={true}
        visible={photoModalVisible}
        animationType="fade"
      >
        <View style={styles.photoModal}>
          <TouchableOpacity
            style={styles.photoModalCross}
            onPress={() => setPhotoModalVisible(false)}
          >
            <Cross width={24} height={24} />
          </TouchableOpacity>
          <Image
            source={{ uri: selectedImage }}
            style={styles.photoModalImage}
          />
          {!previewPhoto && (
            <Button
              variant="white"
              onPress={() => {
                sendImageHandler(imageFormData);
                setPreviewPhoto(false);
              }}
            >
              {t("SEND")}
            </Button>
          )}
        </View>
      </Modal>
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
  messageContainer: {
    flex: 1,
  },
  messageReplyContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 1,
    borderTopWidth: 1,
    borderTopColor: "gray",
    marginHorizontal: -16,
  },
  messageReplyText: {
    paddingLeft: 16,
    borderLeftWidth: 8,
    borderLeftColor: "red",
  },
  messageReplyName: {
    fontWeight: "600",
    fontSize: 16,
    color: "#000000",
    paddingTop: 11,
  },
  messageReplyContent: {
    fontWeight: "400",
    fontSize: 14,
    color: "#000000",
    paddingBottom: 12,
  },
  messageReplyIcon: {
    paddingRight: 16,
  },
  messageSendContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  messageMenu: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 16,
    paddingBottom: 64,
  },
  messageMenuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 18,
    paddingHorizontal: 10,
  },
  messageMenuItemText: {
    fontWeight: "500",
    fontSize: 18,
    lineHeight: 24,
    color: "#000000",
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
  photoModal: {
    flex: 1,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 64,
  },
  photoModalImage: {
    width: "100%",
    height: 400,
    marginBottom: 50,
  },
  photoModalCross: {
    position: "absolute",
    top: 50,
    right: 10,
    backgroundColor: "white",
    borderRadius: 999,
    alignSelf: "flex-start",
  },
});

export default ChatHubScreen;
