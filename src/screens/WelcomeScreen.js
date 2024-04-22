import { Image, StyleSheet, Text, View } from "react-native";
import Button from "../components/Button";
import { useNavigation } from "@react-navigation/native";

const WelcomeScreen = () => {
  const navigation = useNavigation();

  const onMailPressHandler = () => {
    navigation.navigate("MailSignup");
  };

  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={{
          uri: "https://www.indyturk.com/sites/default/files/styles/1368x911/public/article/main_image/2021/02/04/578531-2026990228.jpg?itok=AGueB8X6",
        }}
      />
      <View style={styles.buttons}>
        <Button variant="secondary" onPress={onMailPressHandler}>Mail İle Devam Et</Button>
        <Text>Yada</Text>
        <Button variant="white">Google İle Devam Et</Button>
        <Button variant="primary">Facebook İle Devam Et</Button>
        <Button variant="black">X İle Devam Et</Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    gap: 96,
    paddingHorizontal: 16,
  },
  image: {
    height: 180,
    width: 180,
    borderRadius: 90,
    objectFit: "cover",
  },
  buttons: {
    width: "90%",
    flexDirection: "column",
    gap: 16,
    alignItems: "center",
  },
});

export default WelcomeScreen;
