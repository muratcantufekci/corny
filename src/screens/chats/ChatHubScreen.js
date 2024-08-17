import React, { useEffect, useLayoutEffect } from "react";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
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
import Arrow from "../../assets/svg/arrow-right.svg";
import Plus from "../../assets/svg/plus.svg";
import ArrowUp from "../../assets/svg/arrow-up-circle.svg";
import Input from "../../components/Input";

const ChatHubScreen = () => {
  const image =
    "https://media.licdn.com/dms/image/v2/D4D03AQFB0oznJhn_Eg/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1707992142190?e=1729123200&v=beta&t=8WUd5YODbi2dSoWP56kqBzK3Ir47WJQG-xclk_BV0mE";
  const isFocused = useIsFocused();
  const appUtils = useAppUtils();
  const navigation = useNavigation();

  useEffect(() => {
    if (isFocused) {
      appUtils.setBackgroundColor("#FEFCF5");
      appUtils.setPaddingHorizontal(0);
    }
  }, [isFocused]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <TouchableOpacity style={styles.headerMid}>
          <Image
            source={{
              uri: image,
            }}
            style={styles.headerImg}
          />
          <View style={styles.headerNameWrap}>
            <CustomText style={styles.headerName}>Muratcan</CustomText>
            <Arrow width={24} height={24} style={styles.headerIcon} />
          </View>
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity onPress={() => console.log("Icon tapped")}>
          <Dots width={32} height={32} />
        </TouchableOpacity>
      ),
      headerStyle: {
        borderBottomWidth: 1,
        borderBottomColor: "#E9E9EC",
        height: 85,
        backgroundColor: "#FEFCF5",
      },
      headerTitleContainerStyle: {
        justifyContent: "flex-start",
      },
      headerLeftContainerStyle: {
        justifyContent: "flex-start",
        paddingLeft: 16,
      },
      headerRightContainerStyle: {
        justifyContent: "flex-start",
        paddingRight: 16,
      },
    });
  }, [navigation]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 160 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.messageContainer}>
            <View style={styles.episode}>
              <Image
                source={require("../../assets/images/noise.png")}
                style={styles.episodeNoise}
              />
              <CustomText style={styles.episodeText}>
                Season 1, Episode 1 - The One who Matt and Lydia matches in
                Corny!
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
            <View>
              <CustomText style={styles.messageDate}>12 Ağustos Pzt</CustomText>
            </View>
            <View style={[styles.messageBox, styles.messageBoxIncome]}>
              <CustomText style={styles.message}>Are you Kola ?</CustomText>
            </View>
            <View style={[styles.messageBox, styles.messageBoxSend]}>
              <CustomText style={styles.message}>
                No, Are you Disco ?
              </CustomText>
            </View>
          </View>
          <View style={styles.messageSendContainer}>
            <View style={styles.plusIcon}>
              <Plus />
            </View>
            <View style={styles.inputWrapper}>
              <Input
                placeholder="Bir mesaj yazın"
                afterIcon={<ArrowUp />}
                style={styles.input}
              />
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
    justifyContent: "space-between",
  },
  headerMid: {
    alignItems: "center",
    gap: 4,
  },
  headerImg: {
    width: 48,
    height: 44,
    borderRadius: 999,
  },
  headerNameWrap: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerName: {
    fontWeight: "600",
    fontSize: 16,
    lineHeight: 24,
    color: "#000000",
  },
  headerIcon: {
    marginTop: 2,
  },
  messageContainer: {
    flex: 1,
    justifyContent: "flex-end"
  },
  messageSendContainer: {
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
  plusIcon: {
    width: 32,
    height: 32,
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
});

export default ChatHubScreen;
