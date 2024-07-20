import { Keyboard, StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import CustomText from "../../components/CustomText";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { Formik } from "formik";
import * as Yup from "yup";
import ErrorText from "../../components/ErrorText";

const validation = Yup.object().shape({
  phone: Yup.string()
    .max(10, "Telefon numaranız 10 karakterden fazla olamaz")
    .min(10, "Telefon numaranız 10 karakterden az olamaz")
    .required("Telefon alanı zorunludur!"),
});

const NumberScreen = () => {
  return (
    <Formik
      initialValues={{ phone: "" }}
      validationSchema={validation}
      onSubmit={(values) => console.log(values)}
    >
      {({ 
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
      }) => (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <View>
              <CustomText style={styles.headingText}>
                Numaranızı Giriniz
              </CustomText>
              <CustomText style={styles.descText}>
                Corny, numaranızı doğrulamak için size SMS yoluyla tek kullanımlık
                bir şifre gönderecek
              </CustomText>
              <View style={styles.content}>
                <Input placeholder="Telefon numaranız" />
                <Input
                  placeholder="Telefon numaranız"
                  onChangeText={handleChange("phone")}
                  onBlur={handleBlur("phone")}
                  value={values.phone}
                  variant={
                    (touched.phone && errors.phone && "error") ||
                    (touched.phone && !errors.phone && "success")
                  }
                  inputMode="numeric"
                />
                {touched.phone && errors.phone && (
                  <ErrorText message={errors.phone} />
                )}
              </View>
            </View>
            <Button variant="black" onPress={handleSubmit}>
              Devam Et
            </Button>
          </View>
        </TouchableWithoutFeedback>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    justifyContent: "space-between",
    paddingBottom: 50,
  },
  headingText: {
    fontSize: 26,
    fontWeight: "500",
    lineHeight: 30,
    color: "#000000",
    marginBottom: 8,
  },
  descText: {
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 16,
    color: "#51525C",
  },
  content: {
    marginTop: 32,
    gap: 16,
  },
});

export default NumberScreen;
