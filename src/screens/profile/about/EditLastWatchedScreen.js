import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import useUserStore from "../../../store/useUserStore";
import { postUserAbouts } from "../../../services/User/send-user-about";
import MovieSelect from "../../../components/MovieSelect";

const EditLastWatchedScreen = () => {
  const userStore = useUserStore();
  const [selectedTvShow, setSelectedTvShow] = useState([]);

  useEffect(() => {
    const postLastWatched = async () => {
      const data = {
        title: "LastWatched",
        values: [`${selectedTvShow[0].id}`],
      };

      const response = await postUserAbouts(data);
      if (response.isSuccess) {
        userStore.setUserAbouts([data]);
      }
    };
    if (selectedTvShow.length > 1) {
      setSelectedTvShow((prevState) => [...prevState.slice(1)]);
    }
    if (selectedTvShow.length > 0) {
      postLastWatched();
    }
  }, [selectedTvShow]);

  return (
    <View style={styles.container}>
      <MovieSelect
        selectedTvShows={selectedTvShow}
        setSelectedTvShows={setSelectedTvShow}
        fromAbout
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 30,
    paddingHorizontal: 16
  },
});

export default EditLastWatchedScreen;
