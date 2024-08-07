import { enUS, pl } from 'date-fns/locale';
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

export const langs = [
  {
    value: 'en',
    label: 'English',
    icon: '/icons/en.svg',
  },
  {
    value: 'pl',
    label: 'Polski',
    icon: '/icons/pl.svg',
  },
];

export const locales = {
  en: enUS,
  pl,
};

const missingKeys = new Set();

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    saveMissing: true,
    fallbackLng: 'en',
    load: 'languageOnly',
    detection: {
      lookupLocalStorage: 'lang',
    },
    interpolation: {
      escapeValue: false,
    },
    missingKeyHandler(_, __, key) {
      if (missingKeys.has(key)) {
        return;
      }

      missingKeys.add(key);

      fetch(`${import.meta.env.VITE_BACKEND_URL}/translation/report`, {
        method: 'POST',
        body: JSON.stringify({ key }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    },
  });

export { default } from 'i18next';
