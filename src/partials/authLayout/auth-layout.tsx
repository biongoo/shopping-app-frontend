import { Box, Paper, Stack } from '@mui/material';
import Lottie from 'lottie-react';
import { Outlet } from 'react-router-dom';
import welcome from '../../assets/lotties/welcome.json';
import { Languages } from '../languages';
import { Theme } from '../theme';

export const AuthLayout = () => (
  <Box
    sx={{
      display: 'flex',
      height: '100vh',
      padding: '1rem',
      gap: '1rem',
    }}
  >
    <Paper
      sx={{
        display: { xs: 'none', sm: 'flex' },
        justifyContent: 'center',
        alignItems: 'center',
        maxWidth: '35rem',
        minWidth: '17rem',
        width: '30%',
        padding: '.5rem',
        boxShadow: 8,
        borderRadius: (theme) => theme.shape.borderRadius * 0.5,
      }}
    >
      <Lottie animationData={welcome} loop={true} style={{ width: '400px' }} />
    </Paper>
    <Box sx={{ display: 'flex', flexGrow: 1, flexDirection: 'column' }}>
      <Stack
        direction="row"
        justifyContent="flex-end"
        spacing={0.5}
        height="5vh"
      >
        <Theme />
        <Languages />
      </Stack>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 1,
        }}
      >
        <Outlet />
      </Box>
      <Box height="5vh" />
    </Box>
  </Box>
);
