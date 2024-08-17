import React, { useEffect } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import CustomText from "../../components/CustomText";
import { t } from "i18next";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import useAppUtils from "../../store/useAppUtils";

// const DUMMY_DATA = [];
const DUMMY_DATA = [
  {
    id: 1,
    name: "Muratcan",
    message: "Selam, alim mi seni bu app benim ;)",
    img: "https://media.licdn.com/dms/image/v2/D4D03AQFB0oznJhn_Eg/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1707992142190?e=1729123200&v=beta&t=8WUd5YODbi2dSoWP56kqBzK3Ir47WJQG-xclk_BV0mE",
  },
  {
    id: 2,
    name: "Karen",
    message: "How are you today?",
    img: "https://media.licdn.com/dms/image/v2/D4D03AQFB0oznJhn_Eg/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1707992142190?e=1729123200&v=beta&t=8WUd5YODbi2dSoWP56kqBzK3Ir47WJQG-xclk_BV0mE",
  },
];

const ChatsScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const appUtils = useAppUtils();

  useEffect(() => {
    if (isFocused) {
      appUtils.setBottomTabStyle("flex");
      appUtils.setBackgroundColor("#FFFFFF");
      appUtils.setPaddingHorizontal(16);
    }
  }, [isFocused]);

  const messageBoxPressHandler = () => {
    navigation.navigate("MessageHub");
    appUtils.setBottomTabStyle("none");
  };
  return (
    <View style={styles.container}>
      <View style={styles.tabWrapper}>
        <View style={styles.tab}>
          <CustomText style={styles.tabText}>{t("MESSAGES")}</CustomText>
          {DUMMY_DATA.length > 0 && (
            <View style={styles.tabNumber}>
              <CustomText style={styles.tabNumberText}>
                {DUMMY_DATA.length}
              </CustomText>
            </View>
          )}
        </View>
      </View>
      {DUMMY_DATA.length === 0 ? (
        <View style={styles.emptyImageWrapper}>
          <Image source={require("../../assets/images/dialogs.png")} />
          <CustomText style={styles.emptyText}>
            {t("NOTHING_AROUND")}
          </CustomText>
        </View>
      ) : (
        <View>
          {DUMMY_DATA.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.messageBox}
              onPress={messageBoxPressHandler}
            >
              <Image source={{ uri: item.img }} style={styles.messageImg} />
              <View>
                <CustomText style={styles.messageName}>{item.name}</CustomText>
                <CustomText style={styles.message}>{item.message}</CustomText>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabWrapper: {
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#00000026",
    marginBottom: 16,
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingBottom: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    alignSelf: "flex-start",
  },
  tabText: {
    fontWeight: "500",
    fontSize: 16,
    lineHeight: 24,
    color: "#000000",
  },
  tabNumber: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
    backgroundColor: "#FF524F",
  },
  tabNumberText: {
    fontWeight: "500",
    fontSize: 12,
    lineHeight: 16,
    color: "#000000",
  },
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
    gap: 18,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#0000001A",
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
  message: {
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 24,
    color: "#000000",
  },
});

export default ChatsScreen;
