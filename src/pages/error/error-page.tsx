import { Link, Stack } from '@mui/material';
import Lottie from 'lottie-react';
import { Link as LinkRR } from 'react-router-dom';
import error from '~/assets/lotties/error.json';
import { TranslatedText } from '~/bits';

export const ErrorPage = () => (
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
      <TranslatedText textKey="goBack" variant="h6" />
    </Link>
  </Stack>
);
