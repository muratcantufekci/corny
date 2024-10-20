import React, { useEffect, useRef, useState } from "react";
import {
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import MovieSelect from "../../components/MovieSelect";
import { t } from "i18next";
import AlertSheet from "../../components/AlertSheet";
import useUserStore from "../../store/useUserStore";

const EditMoviesScreen = ({ navigation }) => {
  const [selectedTvShows, setSelectedTvShows] = useState([]);
  const sheetRef = useRef(null);
  const [sheetProps, setSheetProps] = useState(null);
  const [warning, setWarning] = useState(false);
  const userStore = useUserStore();

  useEffect(() => {
    userStore.setUserTvShows(selectedTvShows);
  }, [selectedTvShows]);

  useEffect(() => {
    setSheetProps({
      img: require("../../assets/images/cancelled.png"),
      title: t("UNSUCCESSFULL"),
      desc: t("AT_LEAST_SIX"),
    });
    sheetRef.current?.present();
    setWarning(false)
  }, [warning]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <MovieSelect
          selectedTvShows={selectedTvShows}
          setSelectedTvShows={setSelectedTvShows}
          priorSelect={true}
          addition={true}
          setWarning={setWarning}
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
