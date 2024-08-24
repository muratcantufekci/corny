import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en.json";
import tr from "./tr.json";
import * as Localization from "expo-localization";

const resources = {
  tr: tr,
  en: en,
};

const deviceLanguage = Localization.locale.split('-')[0];

i18n.use(initReactI18next).init({
  compatibilityJSON: "v3",
  resources,
  lng: deviceLanguage,
  fallbackLng: 'en',
});

export default { i18n };
