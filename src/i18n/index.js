import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Importing folder-based language JSON files
import en from "../locales/en/common.json";
import hi from "../locales/hi/common.json";
import jp from "../locales/jp/common.json";
import ae from "../locales/ae/common.json";
import enAU from "../locales/en-AU/common.json";
import ko from "../locales/ko/common.json";
import zh from "../locales/zh/common.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      hi: { translation: hi },
      jp: { translation: jp },
      ae: { translation: ae },
      "en-AU": { translation: enAU },
      ko: { translation: ko },
      zh: { translation: zh }
    },
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
