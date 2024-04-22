import React from "react";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import Input from "../components/Input";
import Button from "../components/Button";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Formik } from "formik";
import * as Yup from "yup";
import FormErrorMessage from "../components/FormErrorMessage";
import { useNavigation } from "@react-navigation/native";

const MailSignUpScreen = () => {
  const navigation = useNavigation();
  return (
    <KeyboardAwareScrollView
      style={styles.container}
      extraHeight={100}
      contentContainerStyle={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Image
          style={styles.image}
          source={{
            uri: "https://www.indyturk.com/sites/default/files/styles/1368x911/public/article/main_image/2021/02/04/578531-2026990228.jpg?itok=AGueB8X6",
          }}
        />
        <Formik
          onSubmit={(values) => {
            console.log(values)
            navigation.navigate("ProfileSelection");
          }}
          validationSchema={validationSchema}
          initialValues={{
            nameSurname: "",
            email: "",
            username: "",
            password: "",
            gender: "",
            age: "",
          }}
        >
          {({ handleSubmit, handleChange, values, errors, touched }) => (
            <>
              <View style={styles.inputs}>
                <View style={styles.row}>
                  <Input
                    placeholder="Ad/Soyad"
                    inputMode="text"
                    value={values.nameSurname}
                    onChangeText={handleChange("nameSurname")}
                  />
                  {touched.nameSurname && <FormErrorMessage message={errors.nameSurname} />}
                </View>
                <View style={styles.row}>
                  <Input
                    placeholder="Email"
                    inputMode="email"
                    value={values.email}
                    onChangeText={handleChange("email")}
                  />
                  {touched.email &&<FormErrorMessage message={errors.email} />}
                </View>
                <View style={styles.row}>
                  <Input
                    placeholder="Kullanıcı Adı"
                    inputMode="text"
                    value={values.username}
                    onChangeText={handleChange("username")}
                  />
                  {touched.username &&<FormErrorMessage message={errors.username} />}
                </View>
                <View style={styles.row}>
                  <Input
                    placeholder="Şifre"
                    inputMode="text"
                    secureTextEntry
                    value={values.password}
                    onChangeText={handleChange("password")}
                  />
                  {touched.password && <FormErrorMessage message={errors.password} />}
                </View>
                <View style={styles.row}>
                  <Input
                    placeholder="Cinsiyet"
                    inputMode="text"
                    value={values.gender}
                    onChangeText={handleChange("gender")}
                  />
                  {touched.gender && <FormErrorMessage message={errors.gender} />}
                </View>
                <View style={styles.row}>
                  <Input
                    placeholder="Yaş(GG/AA/YYYY)"
                    inputMode="text"
                    value={values.age}
                    onChangeText={handleChange("age")}
                  />
                  {touched.age && <FormErrorMessage message={errors.age} />}
                </View>
              </View>
              <View style={styles.button}>
                <Button type="submit" onPress={() => handleSubmit()}>
                  Devam Et
                </Button>
              </View>
            </>
          )}
        </Formik>
      </ScrollView>
    </KeyboardAwareScrollView>
  );
};

const validationSchema = Yup.object().shape({
  nameSurname: Yup.string().required("Bu alan boş bırakılamaz!"),
  email: Yup.string()
    .email("Lütfen geçerli bir email formatı giriniz!")
    .required("Bu alan boş bırakılamaz!"),
  username: Yup.string().required("Bu alan boş bırakılamaz!"),
  password: Yup.string().required("Bu alan boş bırakılamaz!"),
  gender: Yup.string().required("Bu alan boş bırakılamaz!"),
  age: Yup.string().required("Bu alan boş bırakılamaz!"),
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  content: {
    flexGrow: 1,
    gap: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    height: 140,
    width: 140,
    borderRadius: 70,
  },
  inputs: {
    width: "100%",
    gap: 8,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  row: {
    width: "100%",
  },
  button: {
    width: "100%",
    paddingHorizontal: 20,
  },
});

export default MailSignUpScreen;
