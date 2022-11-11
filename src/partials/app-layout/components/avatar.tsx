import { Avatar as AvatarMui } from '@mui/material';
import { IconMenu } from '~/bits';
import { AvatarContent } from './avatar-content';

export const Avatar = () => (
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
      titleKey: 'account',
    }}
    content={AvatarContent}
  />
);
