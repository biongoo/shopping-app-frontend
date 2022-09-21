import { Stack, Typography } from '@mui/material';
import Lottie from 'lottie-react';
import { useTranslation } from 'react-i18next';
import error from '~/assets/lotties/error.json';

export const ErrorPage = () => {
  const { t } = useTranslation();

  return (
    <Stack
      direction="column"
      justifyContent="center"
      alignItems="center"
      spacing={1}
      height="100vh"
    >
      <Lottie
        animationData={error}
        loop={true}
        style={{ maxHeight: '80vh', maxWidth: '90vw' }}
      />
      <Typography variant="h6">{t('goBack')}</Typography>
    </Stack>
  );
};
