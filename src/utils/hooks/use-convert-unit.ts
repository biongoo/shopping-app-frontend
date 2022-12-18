import { useTranslation } from 'react-i18next';
import { Unit } from '~/enums';

export const useConvertUnit = (count: number, unit: Unit) => {
  const { t, i18n } = useTranslation();

  const lang = i18n.resolvedLanguage;

  switch (unit) {
    case Unit.packs: {
      return t('unitPkg', { localCount: toLocalNumber(count, lang) });
    }
    case Unit.pieces: {
      return t('unitPcs', { localCount: toLocalNumber(count, lang) });
    }
    case Unit.grams: {
      if (count < 10) {
        return t('unitG', { localCount: toLocalNumber(count, lang) });
      }

      if (count < 1000) {
        return t('unitDag', { localCount: toLocalNumber(count / 10, lang) });
      }

      return t('unitKg', { localCount: toLocalNumber(count / 1000, lang) });
    }
    case Unit.milliliters: {
      if (count < 1000) {
        return t('unitMl', { localCount: toLocalNumber(count, lang) });
      }

      return t('unitL', { localCount: toLocalNumber(count / 1000, lang) });
    }
  }
};

const toLocalNumber = (count: number, lang: string) => {
  return count.toLocaleString(lang, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
};
