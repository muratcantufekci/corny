import React, { useEffect, useState } from "react";
import { Dimensions, FlatList, Image, StyleSheet, View } from "react-native";
import CustomText from "../../components/CustomText";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Tabs from "../../components/Tabs";
import Button from "../../components/Button";
import { t } from "i18next";

const TABS_DATA = [
  {
    index: 0,
    name: t("LIKED_ME"),
    count: 18,
  },
  {
    index: 1,
    name: t("VIEWED"),
    count: 5,
  },
  {
    index: 2,
    name: t("MY_LIKES"),
    count: 2,
  },
];

const LIKED_ME_DUMMY = [
  {
    id: 1,
    img: require("../../assets/images/man1.jpeg"),
  },
  {
    id: 2,
    img: require("../../assets/images/girl1.png"),
  },
  {
    id: 3,
    img: require("../../assets/images/girl2.png"),
  },
  {
    id: 4,
    img: require("../../assets/images/girl3.png"),
  },
  {
    id: 5,
    img: require("../../assets/images/girl4.png"),
  },
];

const VIEWED_DUMMY = [
  {
    id: 1,
    img: require("../../assets/images/man1.jpeg"),
  },
  {
    id: 2,
    img: require("../../assets/images/girl2.png"),
  },
  {
    id: 3,
    img: require("../../assets/images/girl4.png"),
  },
  {
    id: 4,
    img: require("../../assets/images/girl1.png"),
  },
  {
    id: 5,
    img: require("../../assets/images/girl3.png"),
  },
];

const MY_LIKES_DUMMY = [];

const RenderItem = ({ item }) => (
  <View style={styles.box}>
    <Image source={item.img} style={styles.boxImg} />
  </View>
);

const LikesScreen = () => {
  const insets = useSafeAreaInsets();
  const [tabContent, setTabContent] = useState(LIKED_ME_DUMMY);
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    setTabContent(() => {
      if (tabIndex === 0) {
        return LIKED_ME_DUMMY;
      } else if (tabIndex === 1) {
        return VIEWED_DUMMY;
      } else {
        return MY_LIKES_DUMMY;
      }
    });
  }, [tabIndex]);

  return (
    <View
      style={{
        paddingTop: insets.top + 20,
        flex: 1,
        paddingHorizontal: 16
      }}
    >
      <Tabs tabsData={TABS_DATA} setTabIndex={setTabIndex} />
      {tabContent.length > 0 ? (
        <FlatList
          data={tabContent}
          renderItem={({ item }) => <RenderItem item={item} />}
          keyExtractor={(item) => item.id}
          style={{ flex: 1 }}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
        />
      ) : (
        <View style={styles.emptyWrapper}>
          <Image source={require("../../assets/images/empy-corns.png")} style={styles.emptyImg} />
          <CustomText style={styles.emptyText}>{t("NOTHING_AROUND")}</CustomText>
        </View>
      )}

      {/* <View style={styles.btnContainer}>
        <Button variant="primary" style={styles.btn}>Test</Button>
      </View> */}
    </View>
  );
};

const imgWidth = (Dimensions.get("window").width - 44) / 2;

const styles = StyleSheet.create({
  columnWrapper: {
    gap: 12,
  },
  box: {
    width: imgWidth,
    height: 210,
    flex: 1,
    marginBottom: 12,
  },
  boxImg: {
    width: imgWidth,
    height: "100%",
    borderRadius: 12,
  },
  btnContainer: {
    alignItems: "center",
    position: "absolute",
    width: "100%",
    bottom: 24,
  },
  btn: {
    width: "95%",
  },
  emptyWrapper: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1
  },
  emptyImg: {
    width: 120,
    height: 120
  },
  emptyText: {
    fontWeight: "500",
    fontSize: 16,
    lineHeight: 25,
    color: "#ACACAC"
  }
});

export default LikesScreen;
