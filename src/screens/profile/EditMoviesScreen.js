import React, { useLayoutEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  Pressable,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import MovieSelect from "../../components/MovieSelect";
import CustomText from "../../components/CustomText";
import { t } from "i18next";
import { postUserMovies } from "../../services/TvShow/send-movie";
import AlertSheet from "../../components/AlertSheet";

const EditMoviesScreen = ({ navigation }) => {
  const [selectedTvShows, setSelectedTvShows] = useState([]);
  const sheetRef = useRef(null);
  const [sheetProps, setSheetProps] = useState(null);
  const [waiting, setWaiting] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        waiting ? (
          <ActivityIndicator />
        ) : (
          <Pressable onPress={saveBtnHandler}>
            <CustomText>{t("SAVE")}</CustomText>
          </Pressable>
        ),
    });
  }, [navigation, selectedTvShows, waiting]);

  const saveBtnHandler = async () => {
    setWaiting(true);
    const data = {
      tvShowIds: selectedTvShows.map((item) => item.id),
    };

    const response = await postUserMovies(data);

    if (response.isSuccess) {
      setSheetProps({
        img: require("../../assets/images/done.png"),
        title: t("SUCCESSFULL"),
        desc: t("SUCCESSFULL_DESC"),
      });
      sheetRef.current?.present();
    } else {
      setSheetProps({
        img: require("../../assets/images/cancelled.png"),
        title: t("UNSUCCESSFULL"),
        desc: t("UNSUCCESSFULL_DESC"),
      });
      sheetRef.current?.present();
    }
    setWaiting(false);
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <MovieSelect
          selectedTvShows={selectedTvShows}
          setSelectedTvShows={setSelectedTvShows}
          priorSelect={true}
        />
        {sheetProps && (
          <AlertSheet sheetProps={sheetProps} sheetRef={sheetRef} />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});

export default EditMoviesScreen;
