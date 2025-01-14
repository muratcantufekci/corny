import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import CustomText from "../../../components/CustomText";
import Dots from "../../../assets/svg/dots-horizontal.svg";
import Back from "../../../assets/svg/arrow-left.svg";

const ChatHubHeader = ({ navigation, userImage, userName, sheetRef, pt }) => {
  return (
    <View style={[styles.headerContainer, { paddingTop: pt }]}>
      <View style={styles.headerWrapper}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 10, paddingLeft: 0 }}>
          <Back width={30} height={30} />
        </TouchableOpacity>
        <View style={styles.headerMid}>
          <Image source={{ uri: userImage }} style={styles.headerImg} />
          <View style={styles.headerNameWrap}>
            <CustomText style={styles.headerName}>{userName}</CustomText>
          </View>
        </View>
      </View>
      <TouchableOpacity onPress={() => sheetRef.current?.present()}>
        <Dots width={32} height={32} />
      </TouchableOpacity>
    </View> 
  );
};

const styles = StyleSheet.create({
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
});

export default ChatHubHeader;