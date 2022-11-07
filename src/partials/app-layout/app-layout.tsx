import { Box, Stack } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { Languages } from '../languages';
import { Theme } from '../theme';

export const AppLayout = () => (
  <Box
    sx={{
      display: 'flex',
      height: '100vh',
      padding: '1rem',
      gap: '1rem',
    }}
  >
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
