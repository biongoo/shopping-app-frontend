import {
  Box,
  Drawer as DrawerMui,
  emphasize,
  SwipeableDrawer,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useState } from 'react';
import { AppBar } from './app-bar';
import { DrawerContent } from './drawer-content';

type Props = {
  drawerWidth: number;
};

export const Drawer = ({ drawerWidth }: Props) => {
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = isSm ? (
    <SwipeableDrawer
      variant="temporary"
      open={mobileOpen}
      onClose={handleDrawerToggle}
      onOpen={handleDrawerToggle}
      ModalProps={{
        keepMounted: true,
      }}
      sx={{
        '& .MuiDrawer-paper': {
          boxSizing: 'border-box',
          width: drawerWidth,
          backgroundImage: 'none',
        },
      }}
    >
      <DrawerContent />
    </SwipeableDrawer>
  ) : (
    <DrawerMui
      variant="permanent"
      sx={{
        '& .MuiDrawer-paper': {
          boxSizing: 'border-box',
          width: drawerWidth,
          backgroundColor: (theme) =>
            emphasize(theme.palette.background.default, 0.01),
        },
      }}
      open
    >
      <DrawerContent />
    </DrawerMui>
  );

  return (
    <>
      <AppBar
        isOpen={mobileOpen}
        drawerWidth={drawerWidth}
        handleDrawerToggle={handleDrawerToggle}
      />
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        {drawer}
      </Box>
    </>
  );
};
