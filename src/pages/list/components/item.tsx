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
  onCheck: (id: number) => void;
  setOpenOptions: (data: ModifyData) => void;
};

export const Item = (props: Props) => {
  const { item, onCheck, setOpenOptions } = props;
  const convertedItem = useConvertUnit(item.count, item.unit);

  return (
    <ListItemMui
      secondaryAction={
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
      }
      disablePadding
      dense={true}
    >
      <ListItemButton
        role={undefined}
        onClick={() => onCheck(item.id)}
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
