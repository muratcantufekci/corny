import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import ProggressBar from "../../components/ProggressBar";
import OnboardingHeading from "../../components/OnboardingHeading";
import Button from "../../components/Button";
import { t } from "i18next";
import { useNavigation } from "@react-navigation/native";
import { postUserMovies } from "../../services/TvShow/send-movie";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MovieSelect from "../../components/MovieSelect";

const MovieScreen = ({ route }) => {
  const reqiredChoiceCount = 6;
  const [isBtnDisabled, setIsBtnDisaled] = useState(true);
  const [btnVariant, setBtnVariant] = useState("disable");
  const [selectedTvShows, setSelectedTvShows] = useState([]);
  const [choiceCount, setChoiceCount] = useState(6);
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (route.params?.disableBack) {
      navigation.setOptions({
        headerLeft: () => null,
      });
    }
  }, [navigation, route.params?.disableBack]);

  useEffect(() => {
    const isBtnDisabled = selectedTvShows.length < reqiredChoiceCount;
    setBtnVariant(isBtnDisabled ? "disable" : "primary");
    setIsBtnDisaled(isBtnDisabled);
  }, [selectedTvShows]);

  const nextBtnHandler = async () => {
    const data = {
      tvShowIds: selectedTvShows.map((item) => item.id),
    };
    const response = await postUserMovies(data);

    if (response.isSuccess) {
      navigation.navigate("Gender");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View
        style={[
          styles.container,
          {
            paddingBottom: insets.bottom,
          },
        ]}
      >
        <View>
          <ProggressBar step={4} totalStep={7}/>
          <OnboardingHeading
            title={t("MOVIE_SCREEN_TITLE")}
            desc={t("MOVIE_SCREEN_DESC")}
            style={styles.textArea}
          />

          <MovieSelect
            selectedTvShows={selectedTvShows}
            setSelectedTvShows={setSelectedTvShows}
            setChoiceCount={setChoiceCount}
            style={{height: Dimensions.get("window").height / 2.1}}
          />
        </View>
        <Button
          variant={btnVariant}
          disabled={isBtnDisabled}
          style={styles.btn}
          onPress={nextBtnHandler}
        >
          {choiceCount <= 0
            ? t("NEXT")
            : t("MAKE_CHOICE") + ` ( ${choiceCount} )`}
        </Button>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 16
  },
  textArea: {
    marginBottom: 24,
  },
  btn: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16
  },
});

export default MovieScreen;
