import React, { useRef, useState } from "react";
import BottomSheet, { BottomSheetMethods } from "@devvie/bottom-sheet";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import SelectionBox from "../components/SelectionBox";
import Input from "../components/Input";
import MovieBox from "../components/MovieBox";
import Button from "../components/Button";

const ProfileSelectionScreen = () => {
  const sheetRef = useRef(null);
  const [tabIsSeries, setTabIsSeries] = useState(true);

  const selectMovie = () => {
    sheetRef.current?.open();
    console.log("adads");
  };

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.title}>Profil Fotoğraflarını Seçiniz</Text>
        <View style={styles.boxes}>
          <SelectionBox />
          <SelectionBox />
          <SelectionBox />
        </View>
        <Text style={styles.title}>Dizi/Filmlerinizi Seçiniz</Text>
        <View style={styles.boxes}>
          <SelectionBox isMovie={true} selectMovie={selectMovie} />
          <SelectionBox isMovie={true} selectMovie={selectMovie} />
          <SelectionBox isMovie={true} selectMovie={selectMovie} />
        </View>
        <View style={styles.button}>
          <Button type="submit">Profili Tamamla</Button>
        </View>
      </View>
      <BottomSheet ref={sheetRef} height="85%">
        <View style={styles.sheetContainer}>
          <View style={styles.sheetTabs}>
            <TouchableOpacity
              style={styles.sheetTab}
              onPress={() => setTabIsSeries(true)}
            >
              <Text style={styles.tabText}>Dizi</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.sheetTab}
              onPress={() => setTabIsSeries(false)}
            >
              <Text style={styles.tabText}>Film</Text>
            </TouchableOpacity>
          </View>
          <Input
            placeholder={
              tabIsSeries
                ? "Aramak istediğiniz dizi ismini yazınız..."
                : "Aramak istediğiniz film ismini yazınız..."
            }
          />
          <ScrollView
            contentContainerStyle={styles.content}
            // keyboardShouldPersistTaps="handled"
          >
            <View style={styles.movieBoxes}>
              <MovieBox img="https://media.themoviedb.org/t/p/w220_and_h330_face/m0KlkqSLoYeGACAgLzOkv2tmpry.jpg" />
              <MovieBox img="https://media.themoviedb.org/t/p/w220_and_h330_face/m0KlkqSLoYeGACAgLzOkv2tmpry.jpg" />
              <MovieBox img="https://media.themoviedb.org/t/p/w220_and_h330_face/m0KlkqSLoYeGACAgLzOkv2tmpry.jpg" />
            </View>
            <View style={styles.movieBoxes}>
              <MovieBox img="https://media.themoviedb.org/t/p/w220_and_h330_face/m0KlkqSLoYeGACAgLzOkv2tmpry.jpg" />
              <MovieBox img="https://media.themoviedb.org/t/p/w220_and_h330_face/m0KlkqSLoYeGACAgLzOkv2tmpry.jpg" />
              <MovieBox img="https://media.themoviedb.org/t/p/w220_and_h330_face/m0KlkqSLoYeGACAgLzOkv2tmpry.jpg" />
            </View>
            <View style={styles.movieBoxes}>
              <MovieBox img="https://media.themoviedb.org/t/p/w220_and_h330_face/m0KlkqSLoYeGACAgLzOkv2tmpry.jpg" />
              <MovieBox img="https://media.themoviedb.org/t/p/w220_and_h330_face/m0KlkqSLoYeGACAgLzOkv2tmpry.jpg" />
              <MovieBox img="https://media.themoviedb.org/t/p/w220_and_h330_face/m0KlkqSLoYeGACAgLzOkv2tmpry.jpg" />
            </View>
            <View style={styles.movieBoxes}>
              <MovieBox img="https://media.themoviedb.org/t/p/w220_and_h330_face/m0KlkqSLoYeGACAgLzOkv2tmpry.jpg" />
              <MovieBox img="https://media.themoviedb.org/t/p/w220_and_h330_face/m0KlkqSLoYeGACAgLzOkv2tmpry.jpg" />
              <MovieBox img="https://media.themoviedb.org/t/p/w220_and_h330_face/m0KlkqSLoYeGACAgLzOkv2tmpry.jpg" />
            </View>
            <View style={styles.movieBoxes}>
              <MovieBox img="https://media.themoviedb.org/t/p/w220_and_h330_face/m0KlkqSLoYeGACAgLzOkv2tmpry.jpg" />
              <MovieBox img="https://media.themoviedb.org/t/p/w220_and_h330_face/m0KlkqSLoYeGACAgLzOkv2tmpry.jpg" />
              <MovieBox img="https://media.themoviedb.org/t/p/w220_and_h330_face/m0KlkqSLoYeGACAgLzOkv2tmpry.jpg" />
            </View>
          </ScrollView>
        </View>
      </BottomSheet>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingHorizontal: 16,
    flex: 1,
  },
  content: {
    paddingBottom: 220,
    // flexGrow: 1,
    // gap: 40,
    // alignItems: "center",
    // justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
  },
  boxes: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  sheetContainer: {
    padding: 16,
  },
  sheetTabs: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  sheetTab: {
    width: "45%",
    padding: 8,
    backgroundColor: "green",
  },
  tabText: {
    textAlign: "center",
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  movieBoxes: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
});

export default ProfileSelectionScreen;
