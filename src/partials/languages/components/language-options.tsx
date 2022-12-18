import { ListItemIcon, MenuItem, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { QueryKey } from '~/enums';
import { langs } from '~/i18n';
import { useClearCache } from '~/utils';
import { LanguageIcon } from './language-icon';

type Props = {
  onClose: () => void;
};

export const LanguageOptions = (props: Props) => {
  const { i18n } = useTranslation();
  const clearCache = useClearCache(QueryKey.products);

  const handleChangeLang = (value: string) => {
    props.onClose();

    if (value === i18n.resolvedLanguage) {
      return;
    }

    setTimeout(() => {
      i18n.changeLanguage(value), 100;
      clearCache();
    });
  };

  const content = langs.map((lang) => (
    <MenuItem
      key={lang.value}
      onClick={() => handleChangeLang(lang.value)}
      selected={i18n.resolvedLanguage === lang.value}
      sx={{
        paddingY: 1,
      }}
    >
      <ListItemIcon>
        <LanguageIcon src={lang.icon} />
      </ListItemIcon>
      <Typography ml={1}>{lang.label}</Typography>
    </MenuItem>
  ));

  return <>{content}</>;
};
