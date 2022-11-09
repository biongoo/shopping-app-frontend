import SettingsIcon from '@mui/icons-material/Settings';
import {
  Box,
  Divider,
  ListItemIcon,
  MenuItem,
  Typography,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import jwtDecode from 'jwt-decode';
import { useTranslation } from 'react-i18next';
import { logOut as logOutApi } from '~/api';
import { Button } from '~/bits';
import { useAuthStore } from '~/stores';
import { User } from '~/types';
import { generateOnSuccess } from '~/utils';

type Props = {
  onClose: () => void;
};

export const AvatarContent = (props: Props) => {
  const { t } = useTranslation();
  const logOut = useAuthStore((store) => store.logOut);
  const accessToken = useAuthStore((store) => store.accessToken);

  if (!accessToken) {
    logOut();
    return null;
  }

  const user = jwtDecode<User>(accessToken);

  const mutation = useMutation({
    mutationFn: logOutApi,
    onSuccess: generateOnSuccess({
      message: 'signedOutSuccessfully',
      fn: logOut,
    }),
    onError: generateOnSuccess({
      message: 'signedOutSuccessfully',
      fn: logOut,
    }),
  });

  const handleLogout = () => {
    mutation.mutate({});
  };

  return (
    <>
      <Box sx={{ my: 1.5, px: 2.5 }}>
        <Typography variant="subtitle1" noWrap>
          {user.email}
        </Typography>
      </Box>
      <Divider />
      <Box sx={{ py: 1 }}>
        <MenuItem sx={{ paddingY: 1 }} onClick={props.onClose}>
          <ListItemIcon>
            <SettingsIcon sx={{ color: 'icon.primary' }} />
          </ListItemIcon>
          <Typography ml={1}>{t('settings')}</Typography>
        </MenuItem>
      </Box>
      <Divider />
      <Box sx={{ p: 2 }}>
        <Button
          fullWidth
          text={t('logout')}
          onClick={handleLogout}
          loading={mutation.isLoading}
        />
      </Box>
    </>
  );
};
