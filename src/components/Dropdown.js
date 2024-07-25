import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import ArrowBottom from "../assets/svg/arrow-bottom.svg";
import Turkiye from "../assets/svg/flags/turkey.svg";
import Italy from "../assets/svg/flags/italy.svg";
import Russia from "../assets/svg/flags/russia.svg";
import UK from "../assets/svg/flags/united-kingdom.svg";
import USA from "../assets/svg/flags/united-states.svg";
import { useState } from "react";
import Input from "./Input";
import useOnboardingStore from "../store/useOnboardingStore";
import CustomText from "./CustomText";
import { useTranslation } from "react-i18next";

const COUNTRIES_DATA = [
  {
    id: 1,
    flag: <Turkiye />,
    phoneCode: "+90",
    code: "TR",
  },
  {
    id: 2,
    flag: <Italy />,
    phoneCode: "+39",
    code: "IT",
  },
  {
    id: 3,
    flag: <UK />,
    phoneCode: "+44",
    code: "UK",
  },
  {
    id: 4,
    flag: <USA />,
    phoneCode: "+1",
    code: "USA",
  },
  {
    id: 5,
    flag: <Russia />,
    phoneCode: "+7",
    code: "RU",
  },
];

const Dropdown = ({ isOpen, setIsOpen }) => {
  const { t } = useTranslation();
  const [flagIcon, setFlagIcon] = useState(<Turkiye />);
  const [countries, setCountries] = useState(
    COUNTRIES_DATA.map((country) => ({
      ...country,
      text: t(`${country.code}`),
    }))
  );
  const countriesCopy = COUNTRIES_DATA.map((country) => ({
    ...country,
    text: t(`${country.code}`),
  }))
  const [country, setCountry] = useState(`${t("TR")} (+90)`);
  const onboardingStore = useOnboardingStore();

  const searchInputChangeHandler = (text) => {
    setCountries(() =>
      countriesCopy.filter((item) => item.text.includes(text))
    );
  };

  return (
    <TouchableWithoutFeedback onPress={() => setIsOpen(false)}>
      <>
        <TouchableOpacity
          style={styles.container}
          onPress={() => setIsOpen(!isOpen)}
        >
          <View style={styles.left}>
            {flagIcon}
            <CustomText style={styles.text}>{country}</CustomText>
          </View>
          <ArrowBottom style={styles.arrow} />
        </TouchableOpacity>
        {isOpen && (
          <View style={styles.wrapper}>
            <Input
              placeholder={t("SEARCH") + "..."}
              onChangeText={(text) => searchInputChangeHandler(text)}
            />
            <ScrollView style={styles.scrollView}>
              {countries.map((item, index) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.dropdownItem,
                    index % 2 === 1 ? styles.dropdownItemGray : "",
                  ]}
                  onPress={() => {
                    setFlagIcon(item.flag);
                    setCountry(`${item.text} (${item.phoneCode})`);
                    setIsOpen(false);
                    onboardingStore.setCode(item.phoneCode);
                  }}
                >
                  {item.flag}
                  <CustomText style={styles.text}>
                    {item.text} ({item.phoneCode})
                  </CustomText>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    width: "100%",
    backgroundColor: "white",
    borderColor: "#D1D1D6",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    position: "relative",
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  text: {
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 24,
    color: "#000000",
  },
  arrow: {
    width: 24,
    height: 24,
  },
  wrapper: {
    width: "98%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
    position: "absolute",
    top: 60,
    left: "1%",
    zIndex: 1,
  },
  scrollView: {
    maxHeight: 143,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "white",
    borderRadius: 10,
  },
  dropdownItemGray: {
    backgroundColor: "#0000000D",
  },
});

export default Dropdown;
