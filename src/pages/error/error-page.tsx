import Lottie from 'lottie-react';
import error from '~/assets/lotties/error.json';
import { Stack, Typography } from '@mui/material';

export const ErrorPage = () => {
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
        style={{ maxHeight: '80vh', maxWidth: '95vw' }}
      />
      <Typography variant="h6">Go back</Typography>
    </Stack>
  );
};
