import CloseIcon from '@mui/icons-material/Close';
import { Alert as AlertMui, AlertTitle, Snackbar } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { IconButton } from '~/bits/button';

export const Alert = () => {
  const { t } = useTranslation();

  return (
    <Snackbar
      open={true}
      autoHideDuration={6000}
      sx={{ maxWidth: { sm: 500, md: 600 } }}
      onClose={(_, reason) => {
        if (reason === 'clickaway') {
          return;
        }

        //handleClose();
        console.log('close');
      }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      <AlertMui
        variant="outlined"
        sx={{ width: '100%' }}
        /* severity={props.alertColor} */
        action={
          <IconButton
            title={t('close')}
            open={false}
            scale={0.7}
            color="inherit"
            /* onClick={props.onClose} */
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
      >
        {/* {title}
        {props.content} */}
        <AlertTitle>Warning</AlertTitle>
        An e-mail confirming the first stage of registration has already been
        sent. Don&apos;t worry, we sent it again and extended the time for
        confirmation.
      </AlertMui>
    </Snackbar>
  );
};
