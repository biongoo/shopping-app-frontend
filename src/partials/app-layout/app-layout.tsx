import { Box, Toolbar } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { Drawer } from './components';

const drawerWidth = 230;

export const AppLayout = () => (
  <Box sx={{ display: 'flex' }}>
    <Drawer drawerWidth={drawerWidth} />
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        width: { xs: '100%', sm: `calc(100% - ${drawerWidth}px)` },
      }}
    >
      <Toolbar />
      <Box
        sx={{
          p: { xs: 2, md: 3 },
          maxWidth: 900,
          margin: 'auto',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  </Box>
);
