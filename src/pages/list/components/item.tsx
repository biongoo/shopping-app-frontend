import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
  Checkbox,
  ListItem as ListItemMui,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { IconButton } from '~/bits';
import { ListItem, ModifyData } from '~/types';
import { useConvertUnit } from '~/utils';

type Props = {
  item: ListItem;
  isOwner: boolean;
  onCheck: (id: ListItem) => void;
  setOpenOptions: (data: ModifyData) => void;
};

export const Item = (props: Props) => {
  const { item, isOwner, onCheck, setOpenOptions } = props;
  const convertedItem = useConvertUnit(item.count, item.unit);

  const action = isOwner ? (
    <IconButton
      scale={0.9}
      placement="left"
      titleKey="options"
      open={false}
      onClick={(e) =>
        setOpenOptions({
          id: item.id,
          element: e.currentTarget,
        })
      }
    >
      <MoreVertIcon />
    </IconButton>
  ) : null;

  return (
    <ListItemMui secondaryAction={action} disablePadding dense={true}>
      <ListItemButton
        role={undefined}
        onClick={() => onCheck(item)}
        dense={true}
      >
        <ListItemIcon sx={{ minWidth: 45 }}>
          <Checkbox
            edge="start"
            tabIndex={-1}
            disableRipple
            checked={item.checked}
          />
        </ListItemIcon>
        <ListItemText
          primary={item.name}
          secondary={item.description}
          sx={{ width: 1 }}
        />
        <ListItemText primary={convertedItem} sx={{ flexShrink: 0, mr: 2.5 }} />
      </ListItemButton>
    </ListItemMui>
  );
};
