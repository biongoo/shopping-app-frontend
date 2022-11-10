import { Box, Toolbar } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { Drawer } from './components';

const drawerWidth = 220;

export const AppLayout = () => (
  <Box sx={{ display: 'flex' }}>
    <Drawer drawerWidth={drawerWidth} />
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: { xs: 1, sm: 2, md: 3 },
        width: { sm: `calc(100% - ${drawerWidth}px)` },
      }}
    >
      <Toolbar />
      <Outlet />
    </Box>
  </Box>
);
