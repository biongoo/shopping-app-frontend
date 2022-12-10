import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import {
  ListItem as ListItemMui,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { ProductPreview } from '~/types';

type Props = {
  product: ProductPreview;
};

export const ListItem = ({ product }: Props) => {
  const icon = product.checked ? (
    <CheckBoxIcon fontSize="inherit" />
  ) : (
    <CheckBoxOutlineBlankIcon fontSize="inherit" />
  );

  const textDecoration = product.checked ? 'line-through' : 'none';

  return (
    <ListItemMui disableGutters sx={{ p: 0 }}>
      <ListItemIcon sx={{ minWidth: 30 }}>{icon}</ListItemIcon>
      <ListItemText sx={{ textDecoration }}>{product.name}</ListItemText>
    </ListItemMui>
  );
};
