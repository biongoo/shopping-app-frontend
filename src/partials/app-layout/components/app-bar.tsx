import MenuIcon from '@mui/icons-material/Menu';
import {
  alpha,
  AppBar as AppBarMui,
  emphasize,
  Stack,
  Toolbar,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { IconButton } from '~/bits';
import { Languages } from '../../languages';
import { Theme } from '../../theme';
import { Avatar } from './avatar';

type Props = {
  isOpen: boolean;
  drawerWidth: number;
  handleDrawerToggle: () => void;
};

export const AppBar = (props: Props) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));

  const menuButton = isSm && (
    <IconButton
      edge="start"
      open={props.isOpen}
      title={t('openMenu')}
      onClick={props.handleDrawerToggle}
    >
      <MenuIcon />
    </IconButton>
  );

  return (
    <AppBarMui
      position="fixed"
      sx={{
        width: { sm: `calc(100% - ${props.drawerWidth}px)` },
        ml: { sm: `${props.drawerWidth}px` },
        backgroundImage: 'none',
        backgroundColor: (theme) =>
          emphasize(alpha(theme.palette.background.default, 0.9), 0.02),
      }}
    >
      <Toolbar>
        {menuButton}
        <Stack
          direction="row"
          spacing={0.5}
          justifyContent="flex-end"
          alignItems="center"
          sx={{ flexGrow: 1 }}
        >
          <Theme />
          <Languages />
          <Avatar />
        </Stack>
      </Toolbar>
    </AppBarMui>
  );
};
