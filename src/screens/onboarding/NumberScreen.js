import {
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import CustomText from "../../components/CustomText";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { Formik } from "formik";
import * as Yup from "yup";
import ErrorText from "../../components/ErrorText";
import Dropdown from "../../components/Dropdown";
import useOnboardingStore from "../../store/useOnboardingStore";
import { useNavigation } from "@react-navigation/native";
import OnboardingHeading from "../../components/OnboardingHeading";

const validation = Yup.object().shape({
  phone: Yup.string()
    .max(10, "Telefon numaranız 10 karakterden fazla olamaz")
    .min(10, "Telefon numaranız 10 karakterden az olamaz")
    .required("Telefon alanı zorunludur!"),
});

const NumberScreen = () => {
  const onboardingStore = useOnboardingStore();
  const navigation = useNavigation();

  const phoneInputChangeHandler = (text, handleChangeFunc) => {
    handleChangeFunc(text);
    onboardingStore.setPhone(onboardingStore.code + text);
  };

  return (
    <Formik
      initialValues={{ phone: "" }}
      validationSchema={validation}
      onSubmit={() => navigation.navigate("PhoneCode")}
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
              <OnboardingHeading
                title="Numaranızı Giriniz"
                desc="Corny, numaranızı doğrulamak için size SMS yoluyla tek kullanımlık
                bir şifre gönderecek"
              />
              <View style={styles.content}>
                <Dropdown />
                <Input
                  placeholder="Telefon numaranız"
                  onChangeText={(text) =>
                    phoneInputChangeHandler(text, handleChange("phone"))
                  }
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
  content: {
    marginTop: 32,
    gap: 16,
  },
});

export default NumberScreen;
