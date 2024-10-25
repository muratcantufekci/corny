import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  View,
} from "react-native";
import CustomText from "../../components/CustomText";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Tabs from "../../components/Tabs";
import Button from "../../components/Button";
import { t } from "i18next";
import { getUserRecievedLikes } from "../../services/Matching/get-user-recieved-likes";
import { getUserLikes } from "../../services/Matching/get-user-likes";
import { useIsFocused } from "@react-navigation/native";

const RenderItem = ({ item }) => {
  return (
    <View style={styles.box} key={item.user.userId}>
      <Image
        source={{ uri: item.user.profileImage?.imageUrl }}
        style={styles.boxImg}
      />
    </View>
  );
};

const LikesScreen = () => {
  const insets = useSafeAreaInsets();
  const [tabContent, setTabContent] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [recievedLikes, setRecievedLikes] = useState([]);
  const [likes, setLikes] = useState([]);
  const [recievedLikesPage, setRecievedLikesPage] = useState(1);
  const [recievedLikesResponse, setRecievedLikesResponse] = useState(null);
  const [likesResponse, setLikesResponse] = useState(null);
  const [likesPage, setLikesPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused();

  const TABS_DATA = [
    {
      index: 0,
      name: t("LIKED_ME"),
      count: recievedLikesResponse?.TotalCount,
    },
    {
      index: 1,
      name: t("MY_LIKES"),
      count: likesResponse?.TotalCount,
    },
  ];

  useEffect(() => {
    setTabContent(() => {
      if (tabIndex === 0) {
        return recievedLikes;
      } else {
        return likes;
      }
    });
  }, [tabIndex, recievedLikes]);

  useEffect(() => {
    if (isFocused) {
      setRecievedLikes([]);
      setRecievedLikesPage(1);
      setLikes([]);
      setLikesPage(1);
    }
  }, [isFocused]);

  useEffect(() => {
    const getRecievedLikes = async () => {
      setLoading(true);
      const response = await getUserRecievedLikes(recievedLikesPage);
      setRecievedLikes((prevLikes) => [
        ...prevLikes,
        ...response.data.Contents,
      ]);
      setRecievedLikesResponse(response.data);
      setLoading(false);
    };
    if(isFocused) {
      getRecievedLikes();
    } else {

    }
  }, [recievedLikesPage,isFocused]);

  useEffect(() => {
    const getLikes = async () => {
      setLoading(true);
      const response = await getUserLikes(likesPage);

      setLikes((prevLikes) => [...prevLikes, ...response.data.Contents]);
      setLikesResponse(response.data);
      setLoading(false);
    };
    if(isFocused) {
      getLikes();
    }
  }, [likesPage,isFocused]);

  const loadMoreTvShows = () => {
    if (!loading) {
      tabIndex === 0
        ? setRecievedLikesPage((prev) => prev + 1)
        : setLikesPage((prev) => prev + 1);
    }
  };

  return (
    <View
      style={{
        paddingTop: insets.top + 20,
        flex: 1,
        paddingHorizontal: 16,
      }}
    >
      <Tabs tabsData={TABS_DATA} setTabIndex={setTabIndex} />
      {tabContent.length > 0 ? (
        <FlatList
          data={tabContent}
          renderItem={({ item }) => <RenderItem item={item} />}
          keyExtractor={(item) => item.user.userId}
          style={{ flex: 1 }}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          onEndReached={
            tabIndex === 0
              ? recievedLikesPage < recievedLikesResponse.TotalPages &&
                loadMoreTvShows
              : likesPage < likesResponse.TotalPages && loadMoreTvShows
          }
          onEndReachedThreshold={0.5}
          ListFooterComponent={loading && <ActivityIndicator />}
        />
      ) : (
        <View style={styles.emptyWrapper}>
          <Image
            source={require("../../assets/images/empy-corns.png")}
            style={styles.emptyImg}
          />
          <CustomText style={styles.emptyText}>
            {t("NOTHING_AROUND")}
          </CustomText>
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
    flex: 1,
  },
  emptyImg: {
    width: 120,
    height: 120,
  },
  emptyText: {
    fontWeight: "500",
    fontSize: 16,
    lineHeight: 25,
    color: "#ACACAC",
  },
});

export default LikesScreen;
