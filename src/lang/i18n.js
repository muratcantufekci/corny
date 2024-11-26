import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en.json";
import tr from "./tr.json";
import * as Localization from "expo-localization";
import * as SecureStore from "expo-secure-store";

const resources = {
  tr: tr,
  en: en,
};

const deviceLanguage = SecureStore.getItem("userLanguage") || Localization.locale.split('-')[0];
SecureStore.setItem("userLanguage", deviceLanguage)

i18n.use(initReactI18next).init({
  compatibilityJSON: "v3",
  resources,
  lng: deviceLanguage,
  fallbackLng: 'en',
});

export default { i18n };
