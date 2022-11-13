import { Box, Stack, Toolbar } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { Drawer } from './components';

const drawerWidth = 230;

export const AppLayout = () => (
  <Stack direction="row">
    <Drawer drawerWidth={drawerWidth} />
    <Stack
      component="main"
      alignItems="center"
      sx={{
        height: '100vh',
        minWidth: '270px',
        width: { xs: '100%', sm: `calc(100% - ${drawerWidth}px)` },
      }}
    >
      <Toolbar />
      <Box
        sx={{
          overflow: 'auto',
          width: '100%',
          maxWidth: 900,
          p: { xs: 2, md: 3 },
        }}
      >
        <Outlet />
      </Box>
    </Stack>
  </Stack>
);
