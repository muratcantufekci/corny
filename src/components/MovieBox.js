import { Image, StyleSheet, TouchableOpacity } from "react-native";

const MovieBox = ({ img }) => {
  return (
    <TouchableOpacity style={styles.container}>
      <Image source={{ uri: img }} style={styles.image} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 170,
    borderWidth: 2,
    borderRadius: 8,
    borderColor: "black",
    overflow: 'hidden',
  },
  image: {
    width: "100%",
    height: "100%",
  },
});

export default MovieBox;
