import { useTranslation } from 'react-i18next';
import { IconMenu } from '~/bits';
import { langs } from '~/i18n';
import { LanguageIcon, LanguageOptions } from './components';

export const Languages = () => {
  const { i18n } = useTranslation();
  const actualLanguage = langs.find((x) => x.value === i18n.resolvedLanguage);

  return (
    <IconMenu
      iconProps={{
        titleKey: 'language',
        children: <LanguageIcon src={actualLanguage?.icon ?? langs[0].icon} />,
      }}
      content={LanguageOptions}
    />
  );
};
