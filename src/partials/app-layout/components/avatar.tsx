import { Avatar as AvatarMui } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { IconMenu } from '~/bits';
import { AvatarContent } from './avatar-content';

export const Avatar = () => {
  const { t } = useTranslation();

  return (
    <IconMenu
      iconProps={{
        children: (
          <AvatarMui
            sx={{
              bgcolor: 'primary.main',
              width: 30,
              height: 30,
            }}
          />
        ),
        title: t('account'),
      }}
      content={AvatarContent}
    />
  );
};
