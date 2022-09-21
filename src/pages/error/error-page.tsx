import { Stack, Typography, Link } from '@mui/material';
import Lottie from 'lottie-react';
import { useTranslation } from 'react-i18next';
import { Link as LinkRR } from 'react-router-dom';
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
      <Link component={LinkRR} to="/" color="inherit">
        <Typography variant="h6">{t('goBack')}</Typography>
      </Link>
    </Stack>
  );
};
