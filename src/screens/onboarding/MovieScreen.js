import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import ProggressBar from "../../components/ProggressBar";
import OnboardingHeading from "../../components/OnboardingHeading";
import SelectionBox from "../../components/SelectionBox";
import Button from "../../components/Button";
import { t } from "i18next";
import Input from "../../components/Input";
import { getTvShowsByPopularity } from "../../services/get-tv-shows-by-popularity";
import Search from "../../assets/svg/search.svg";
import CustomText from "../../components/CustomText";
import { searchTvShowsByText } from "../../services/search-tv-shows";

const MovieScreen = () => {
  const reqiredChoiceCount = 5;
  const [isBtnDisabled, setIsBtnDisaled] = useState(true);
  const [btnVariant, setBtnVariant] = useState("disable");
  const [tvShows, setTvShows] = useState([]);
  const [tvShowsCopy, setTvShowsCopy] = useState([]);
  const [selectedTvShows, setSelectedTvShows] = useState([]);
  const [choiceCount, setChoiceCount] = useState(5);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchInputValue, setSearchInputValue] = useState("")

  useEffect(() => {
    const getTvShows = async () => {
      try {
        setLoading(true);
        const res = await getTvShowsByPopularity(page);
        setTvShows((prevTvShows) => [...prevTvShows, ...res.tvShows]);
        setTvShowsCopy((prevTvShows) => [
          ...prevTvShows,
          ...res.tvShows,
        ]);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    getTvShows();
  }, [page]);

  useEffect(() => {
    const isBtnDisabled = selectedTvShows.length < reqiredChoiceCount;
    setBtnVariant(isBtnDisabled ? "disable" : "primary");
    setIsBtnDisaled(isBtnDisabled);
  }, [selectedTvShows]);

  const selectTvShow = (id, name, poster) => {
    const isAlreadySelected = selectedTvShows.some(
      (tvShow) => tvShow.id === id
    );

    if (isAlreadySelected) {
      setSelectedTvShows(selectedTvShows.filter((tvShow) => tvShow.id !== id));
      setChoiceCount((prevState) => prevState + 1);
    } else {
      setSelectedTvShows([...selectedTvShows, { id, name, poster }]);
      setChoiceCount((prevState) => prevState - 1);
    }
  };

  const loadMoreTvShows = () => {
    if (!loading) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const searchTvShows = async (text) => {
    setSearchInputValue(text)
    if (text.length >= 3) {
      try {
        setLoading(true);
        const res = await searchTvShowsByText(text);
        setTvShows(res.tvShows);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    }
  };

  const clearBtnHandler = () => {
    setSearchInputValue("")
    setTvShows(tvShowsCopy)
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View>
          <ProggressBar step={4} />
          <OnboardingHeading
            title={t("MOVIE_SCREEN_TITLE")}
            desc={t("MOVIE_SCREEN_DESC")}
            style={styles.textArea}
          />
          <View style={styles.searchWrapper}>
            <Input
              placeholder={t("SEARCH_MOVIE")}
              beforeIcon={<Search />}
              onChangeText={(text) => searchTvShows(text)}
              style={styles.input}
              value={searchInputValue}
            />
            {searchInputValue.length > 0 && (
              <CustomText style={styles.searchActionText} onPress={clearBtnHandler}>{t("CLEAR")}</CustomText>
            )}
          </View>
          <View style={styles.boxes}>
            <FlatList
              columnWrapperStyle={styles.box}
              data={tvShows}
              renderItem={({ item }) => (
                <SelectionBox
                  isMovie={true}
                  img={item.poster}
                  selectFunc={() =>
                    selectTvShow(item.id, item.name, item.poster)
                  }
                  selected={selectedTvShows.some(
                    (tvShow) => tvShow.id === item.id
                  )}
                />
              )}
              keyExtractor={(item) => item.id}
              numColumns={3}
              onEndReached={searchInputValue.length <= 0 && loadMoreTvShows}
              onEndReachedThreshold={0.5}
              ListFooterComponent={loading && <ActivityIndicator />}
            />
          </View>
        </View>
        <Button
          variant={btnVariant}
          disabled={isBtnDisabled}
          style={styles.btn}
        >
          {choiceCount <= 0
            ? t("NEXT")
            : t("MAKE_CHOICE") + ` ( ${choiceCount} )`}
        </Button>
      </View>
    </TouchableWithoutFeedback>
  );
};

const boxesHeight = Dimensions.get("window").height / 2.1;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 22,
  },
  searchActionText: {
    fontWeight: "500",
    fontSize: 16,
    lineHeight: 24,
  },
  input: {
    flex: 1,
  },
  boxes: {
    marginTop: 24,
    height: boxesHeight,
    paddingBottom: 40,
  },
  box: {
    gap: 16,
  },
  textArea: {
    marginBottom: 24,
  },
  btn: {
    position: "absolute",
    bottom: 0,
  },
});

export default MovieScreen;
