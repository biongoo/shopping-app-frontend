import { ListItemIcon, MenuItem, Typography } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { langs } from '~/i18n';
import { LanguageIcon } from './language-icon';

type Props = {
  onClose: () => void;
};

export const LanguageOptions = (props: Props) => {
  const { i18n } = useTranslation();
  const queryClient = useQueryClient();

  const handleChangeLang = (value: string) => {
    props.onClose();

    if (value === i18n.resolvedLanguage) {
      return;
    }

    queryClient.invalidateQueries({ queryKey: ['products'] });

    setTimeout(() => i18n.changeLanguage(value), 100);
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
