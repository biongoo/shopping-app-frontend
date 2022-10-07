import { Box, Paper } from '@mui/material';
import Lottie from 'lottie-react';
import { Outlet } from 'react-router-dom';
import welcome from '../../assets/lotties/welcome.json';
import { Languages } from '../languages';

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
      }}
    >
      <Lottie animationData={welcome} loop={true} style={{ width: '400px' }} />
    </Paper>
    <Box sx={{ display: 'flex', flexGrow: 1, flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'end' }}>
        <Languages />
      </Box>
      <Outlet />
    </Box>
  </Box>
);
