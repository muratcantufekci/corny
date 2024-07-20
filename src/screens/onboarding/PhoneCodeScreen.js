import { Text, View } from "react-native";
import OnboardingHeading from "../../components/OnboardingHeading";

const PhoneCodeScreen = () => {
  return (
    <View>
      <OnboardingHeading
        title="OTP'yi girin"
        desc="Corny, numaranızı doğrulamak için size SMS yoluyla tek kullanımlık bir şifre gönderecek"
      />
    </View>
  );
};

export default PhoneCodeScreen;
