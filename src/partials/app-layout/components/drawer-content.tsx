import CategoryIcon from '@mui/icons-material/Category';
import HomeIcon from '@mui/icons-material/Home';
import StoreIcon from '@mui/icons-material/Store';
import {
  alpha,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';

type Props = {
  onClick?: () => void;
};

const pages = [
  {
    key: 'home',
    icon: HomeIcon,
    path: '/app/home',
  },
  {
    key: 'shops',
    icon: StoreIcon,
    path: '/app/shop',
  },
  {
    key: 'products',
    icon: CategoryIcon,
    path: '/app/product',
  },
] as const;

export const DrawerContent = (props: Props) => {
  const { t } = useTranslation();

  const listContent = pages.map((page) => (
    <ListItem
      key={page.key}
      disablePadding
      component={NavLink}
      onClick={props.onClick}
      to={page.path}
      sx={{
        color: 'text.primary',
        '&.active': {
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
          color: 'primary.main',
          borderRight: '3px solid',
          '& .MuiSvgIcon-root': {
            color: 'primary.main',
          },
        },
      }}
    >
      <ListItemButton>
        <ListItemIcon>
          <page.icon sx={{ color: 'icon.primary' }} />
        </ListItemIcon>
        <ListItemText primary={t(page.key)} />
      </ListItemButton>
    </ListItem>
  ));

  return (
    <div>
      <Toolbar sx={{ justifyContent: 'center' }}>
        <Typography variant="h6">{import.meta.env.VITE_APP_TITLE}</Typography>
      </Toolbar>
      <List>{listContent}</List>
    </div>
  );
};
