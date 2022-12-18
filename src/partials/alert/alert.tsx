import { Alert as AlertMui, AlertTitle, Snackbar } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useUiStore } from '~/stores';

export const Alert = () => {
  const { t } = useTranslation();
  const alert = useUiStore((state) => state.alert);
  const hideAlert = useUiStore((state) => state.hideAlert);

  const title = alert.titleKey ? (
    <AlertTitle>{t(alert.titleKey)}</AlertTitle>
  ) : undefined;

  const body = alert.bodyKey ? (
    <AlertTitle>{t(alert.bodyKey)}</AlertTitle>
  ) : undefined;

  return (
    <Snackbar
      open={alert.open}
      autoHideDuration={alert.time}
      sx={{ maxWidth: { sm: 500, md: 600 } }}
      anchorOrigin={{
        horizontal: 'right',
        vertical: 'bottom',
      }}
      onClose={hideAlert}
    >
      <AlertMui
        variant="filled"
        sx={{ width: '100%' }}
        severity={alert.variant}
        onClose={hideAlert}
      >
        {title}
        {body}
      </AlertMui>
    </Snackbar>
  );
};
