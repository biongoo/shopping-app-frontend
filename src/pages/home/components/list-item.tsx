import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import {
  ListItem as ListItemMui,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { ListItemPreview } from '~/types';

type Props = {
  item: ListItemPreview;
};

export const ListItem = ({ item }: Props) => {
  const icon = item.checked ? (
    <CheckBoxIcon fontSize="inherit" />
  ) : (
    <CheckBoxOutlineBlankIcon fontSize="inherit" />
  );

  const textDecoration = item.checked ? 'line-through' : 'none';

  return (
    <ListItemMui disableGutters sx={{ p: 0 }}>
      <ListItemIcon sx={{ minWidth: 30 }}>{icon}</ListItemIcon>
      <ListItemText sx={{ textDecoration }}>{item.product.name}</ListItemText>
    </ListItemMui>
  );
};
