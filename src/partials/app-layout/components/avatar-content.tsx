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
import { useNavigate } from 'react-router-dom';
import { logOut as logOutApi } from '~/api';
import { Button, TranslatedText } from '~/bits';
import { useAuthStore } from '~/stores';
import { Jwt } from '~/types';
import { generateOnSuccess } from '~/utils';

type Props = {
  onClose: () => void;
};

export const AvatarContent = (props: Props) => {
  const navigate = useNavigate();
  const mutation = useMutation(logOutApi);
  const logOut = useAuthStore((store) => store.logOut);
  const accessToken = useAuthStore((store) => store.accessToken);

  if (!accessToken) {
    logOut();
    return null;
  }

  const jwt = jwtDecode<Jwt>(accessToken);

  const handleLogout = () => {
    mutation.mutate(undefined, {
      onSuccess: generateOnSuccess({
        message: 'signedOutSuccessfully',
        fn: logOut,
      }),
      onError: generateOnSuccess({
        message: 'signedOutSuccessfully',
        fn: logOut,
      }),
    });
  };

  const handleGoSettings = () => {
    navigate('/app/settings');
    props.onClose();
  };

  return (
    <Box minWidth={200}>
      <Box sx={{ my: 1.5, px: 2.5 }}>
        <Typography variant="subtitle1" noWrap textAlign="center">
          {jwt.email}
        </Typography>
      </Box>
      <Divider />
      <Box sx={{ py: 1 }}>
        <MenuItem sx={{ paddingY: 1 }} onClick={handleGoSettings}>
          <ListItemIcon>
            <SettingsIcon sx={{ color: 'icon.primary' }} />
          </ListItemIcon>
          <TranslatedText ml={1} textKey="settings" />
        </MenuItem>
      </Box>
      <Divider />
      <Box sx={{ p: 2 }}>
        <Button
          fullWidth
          textKey="logout"
          onClick={handleLogout}
          loading={mutation.isLoading}
        />
      </Box>
    </Box>
  );
};
