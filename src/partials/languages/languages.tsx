import { useTranslation } from 'react-i18next';
import { IconMenu } from '~/bits';
import { langs } from '~/i18n';
import { LanguageIcon, LanguageOptions } from './components';

export const Languages = () => {
  const { i18n, t } = useTranslation();
  const actualLanguage = langs.find((x) => x.value === i18n.resolvedLanguage);

  return (
    <IconMenu
      iconProps={{
        children: <LanguageIcon src={actualLanguage?.icon ?? langs[0].icon} />,
        title: t('language'),
      }}
      content={LanguageOptions}
    />
  );
};
