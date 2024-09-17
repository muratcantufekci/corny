import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import MovieSelect from "../../../components/MovieSelect";
import { postUserAbouts } from "../../../services/User/send-user-about";
import useUserStore from "../../../store/useUserStore";
import { getTvShowById } from "../../../services/TvShow/get-tv-show-by-id";

const EditGuiltyPleasureScreen = () => {
  const userStore = useUserStore();
  const [selectedTvShow, setSelectedTvShow] = useState([]);

  useEffect(() => {
    const postGuiltyPleasure = async () => {

      const data = {
        title: "GuiltyPleasure",
        values: [`${selectedTvShow[0].id}`],
      };

      const response = await postUserAbouts(data);
      if (response.isSuccess) {
        const tvShowResponse = await getTvShowById(selectedTvShow[0].id)
        if(tvShowResponse.isSuccess) {
            userStore.setUserAbouts([{
                title: "GuiltyPleasure",
                values: [`${tvShowResponse.tvShow.name}`]
            }]);
        }
      }
    };
    if (selectedTvShow.length > 1) {
      setSelectedTvShow((prevState) => [...prevState.slice(1)]);
    }
    if (selectedTvShow.length > 0) {
      postGuiltyPleasure();
    }
  }, [selectedTvShow]);

  return (
    <View style={styles.container}>
      <MovieSelect
        selectedTvShows={selectedTvShow}
        setSelectedTvShows={setSelectedTvShow}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 30,
  },
});

export default EditGuiltyPleasureScreen;
