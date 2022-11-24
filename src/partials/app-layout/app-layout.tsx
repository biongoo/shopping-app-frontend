import { Box, Stack, Toolbar } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { Drawer } from './components';

const drawerWidth = 230;

export const AppLayout = () => (
  <Stack direction="row">
    <Drawer drawerWidth={drawerWidth} />
    <Box
      component="main"
      alignItems="center"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        minWidth: '270px',
        width: { xs: '100%', sm: `calc(100% - ${drawerWidth}px)` },
      }}
    >
      <Toolbar />
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          overflow: 'auto',
          flexDirection: 'column',
          width: '100%',
          maxWidth: 900,
          p: { xs: 1.5, md: 3 },
        }}
      >
        <Outlet />
      </Box>
    </Box>
  </Stack>
);
