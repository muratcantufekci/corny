import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, View } from "react-native";
import SelectionBox from "./SelectionBox";
import { getTvShowsByPopularity } from "../services/TvShow/get-tv-shows-by-popularity";
import { searchTvShowsByText } from "../services/TvShow/search-tv-shows";
import Input from "../components/Input";
import { t } from "i18next";
import Search from "../assets/svg/search.svg";
import CustomText from "./CustomText";
import { addUserTvShow } from "../services/TvShow/add-tv-show";
import { removeUserTvShow } from "../services/TvShow/remove-tv-show";

const MovieSelect = ({
  selectedTvShows,
  setSelectedTvShows,
  setChoiceCount,
  priorSelect = false,
  fromAbout = false,
  addition = false,
  setWarning,
  style,
}) => {
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [searchInputValue, setSearchInputValue] = useState("");
  const [tvShows, setTvShows] = useState([]);
  const [tvShowsCopy, setTvShowsCopy] = useState([]);

  useEffect(() => {
    const getTvShows = async () => {
      try {
        setLoading(true);
        const res = await getTvShowsByPopularity(page, priorSelect);
        setTvShows((prevTvShows) => [...prevTvShows, ...res.tvShows]);
        setTvShowsCopy((prevTvShows) => [...prevTvShows, ...res.tvShows]);
        if (!fromAbout) {
          const newSelectedTvShows = res.tvShows
            .filter((item) => item.isSelected)
            .map((item) => ({
              id: item.id,
              name: item.name,
              poster: item.poster,
            }));

          setSelectedTvShows((prevSelected) => [
            ...prevSelected,
            ...newSelectedTvShows,
          ]);
        }
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    getTvShows();
  }, [page]);

  const searchTvShows = async (text) => {
    setSearchInputValue(text);
    if (text.length > 0) {
      try {
        setLoading(true);
        const res = await searchTvShowsByText(text);
        setTvShows(res.tvShows);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    } else {
      setTvShows(tvShowsCopy);
    }
  };

  const loadMoreTvShows = () => {
    if (!loading) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const selectTvShow = async (id, name, poster) => {
    const isAlreadySelected = selectedTvShows.some(
      (tvShow) => tvShow.id === id
    );

    if (isAlreadySelected) {
      if (selectedTvShows.length > 6) {
        setSelectedTvShows(
          selectedTvShows.filter((tvShow) => tvShow.id !== id)
        );
        setChoiceCount && setChoiceCount((prevState) => prevState + 1);
        if (addition) {
          const responsee = await removeUserTvShow(id);
        }
      } else {
        setWarning(true)
      }
    } else {
      setSelectedTvShows([...selectedTvShows, { id, name, poster }]);
      setChoiceCount && setChoiceCount((prevState) => prevState - 1);
      if (addition) {
        const response = await addUserTvShow(id);
      }
    }
  };

  const clearBtnHandler = () => {
    setSearchInputValue("");
    setTvShows(tvShowsCopy);
  };

  return (
    <>
      <View style={styles.searchWrapper}>
        <Input
          placeholder={t("SEARCH_MOVIE")}
          beforeIcon={<Search />}
          onChangeText={(text) => searchTvShows(text)}
          style={styles.input}
          value={searchInputValue}
        />
        {searchInputValue.length > 0 && (
          <CustomText style={styles.searchActionText} onPress={clearBtnHandler}>
            {t("CLEAR")}
          </CustomText>
        )}
      </View>
      <View style={[styles.boxes, style]}>
        <FlatList
          columnWrapperStyle={styles.box}
          data={tvShows}
          renderItem={({ item }) => (
            <SelectionBox
              isMovie={true}
              img={item.poster}
              selectFunc={() => selectTvShow(item.id, item.name, item.poster)}
              selected={selectedTvShows.some((tvShow) => tvShow.id === item.id)}
            />
          )}
          keyExtractor={(item) => item.id}
          numColumns={3}
          onEndReached={searchInputValue.length <= 0 && loadMoreTvShows}
          onEndReachedThreshold={0.5}
          ListFooterComponent={loading && <ActivityIndicator />}
        />
      </View>
    </>
  );
};

const styles = {
  boxes: {
    marginTop: 24,
    paddingBottom: 40,
  },
  box: {
    gap: 16,
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
};

export default MovieSelect;
