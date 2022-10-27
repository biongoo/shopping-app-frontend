import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';
import { Lang } from './enums';

export const langs = [
  {
    value: Lang.en,
    label: 'English',
    icon: '/icons/en.svg',
  },
  {
    value: Lang.pl,
    label: 'Polski',
    icon: '/icons/pl.svg',
  },
];

const missingKeys = new Set();

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    saveMissing: true,
    fallbackLng: 'en',
    load: 'languageOnly',
    detection: {
      lookupLocalStorage: 'lang',
    },
    interpolation: {
      escapeValue: false,
    },
    missingKeyHandler(langs, ns, key) {
      langs;
      ns;

      if (missingKeys.has(key)) {
        return;
      }

      missingKeys.add(key);

      fetch(`${import.meta.env.VITE_BASE_URL}translation/report`, {
        method: 'POST',
        body: JSON.stringify({ key }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    },
  });

export { default } from 'i18next';
