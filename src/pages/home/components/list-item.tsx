import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import {
  Box,
  ListItem as ListItemMui,
  ListItemIcon,
  Typography,
} from '@mui/material';
import { ListItemPreview } from '~/types';
import { useConvertUnit } from '~/utils';

type Props = {
  item: ListItemPreview;
};

export const ListItem = ({ item }: Props) => {
  const convertedItem = useConvertUnit(item.count, item.unit);

  const icon = item.checked ? (
    <CheckBoxIcon fontSize="inherit" />
  ) : (
    <CheckBoxOutlineBlankIcon fontSize="inherit" />
  );

  const textDecoration = item.checked ? 'line-through' : 'none';

  return (
    <ListItemMui disableGutters sx={{ p: 0 }}>
      <ListItemIcon sx={{ minWidth: 30 }}>{icon}</ListItemIcon>
      <Box
        sx={{
          textDecoration,
          width: 1,
          display: 'flex',
          justifyContent: 'space-between',
          overflow: 'hidden',
        }}
      >
        <Typography
          variant="body2"
          sx={{ width: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}
        >
          {item.product.name}
        </Typography>
        <Typography variant="body2" sx={{ flexShrink: 0 }}>
          {convertedItem}
        </Typography>
      </Box>
    </ListItemMui>
  );
};
