import { Box, Paper } from '@mui/material';
import Lottie from 'lottie-react';
import { Outlet } from 'react-router-dom';
import welcome from '../../assets/lotties/welcome.json';

export const AuthLayout = () => {
  return (
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
          flexGrow: 1,
          maxWidth: '35rem',
          padding: '1.5rem',
        }}
      >
        <Lottie
          animationData={welcome}
          loop={true}
          style={{ width: '400px' }}
        />
      </Paper>
      <Box sx={{ display: 'flex', flexGrow: 1.5, backgroundColor: 'red' }}>
        <Outlet />
      </Box>
    </Box>
  );
};
