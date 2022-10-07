import { ListItemIcon, MenuItem, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { langs } from '~/i18n';
import { LanguageIcon } from './language-icon';

export const LanguageOptions = () => {
  const { i18n } = useTranslation();

  const content = langs.map((lang) => (
    <MenuItem
      key={lang.value}
      onClick={() => i18n.changeLanguage(lang.value)}
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
