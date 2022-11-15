import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { ListItemIcon, MenuItem, Popover } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { TranslatedText } from '~/bits';
import { Shop } from '~/types';
import { useModal } from '~/utils';
import { DeleteShopModal } from './delete-shop-modal';
import { EditShopModal } from './edit-shop-modal';

export type ModifyData = {
  id: number;
  element: HTMLElement;
} | null;

type Props = {
  shops: Shop[];
  data: ModifyData;
  onClose: () => void;
};

export const ModifyShop = (props: Props) => {
  const navigate = useNavigate();
  const [editModal, setOpenEdit, setCloseEdit] = useModal<Shop>();
  const [deleteModal, setOpenDelete, setCloseDelete] = useModal<Shop>();

  const shop = props.shops.find((x) => x.id === props.data?.id);

  const handleOpenEdit = () => {
    if (!shop) {
      return;
    }

    props.onClose();
    setOpenEdit(shop);
  };

  const handleOpenDelete = () => {
    if (!shop) {
      return;
    }

    props.onClose();
    setOpenDelete(shop);
  };

  return (
    <>
      <Popover
        open={Boolean(props.data)}
        anchorEl={props.data?.element}
        onClose={props.onClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem onClick={() => navigate(`/app/shop/${props.data?.id}`)}>
          <ListItemIcon>
            <AddBusinessIcon />
          </ListItemIcon>
          <TranslatedText ml={1} textKey="sections" />
        </MenuItem>
        <MenuItem onClick={handleOpenEdit}>
          <ListItemIcon>
            <EditIcon />
          </ListItemIcon>
          <TranslatedText ml={1} textKey="edit" />
        </MenuItem>
        <MenuItem onClick={handleOpenDelete}>
          <ListItemIcon>
            <DeleteIcon />
          </ListItemIcon>
          <TranslatedText ml={1} textKey="delete" />
        </MenuItem>
      </Popover>
      <EditShopModal
        shop={editModal.data}
        isOpen={editModal.isOpen}
        onClose={setCloseEdit}
      />
      <DeleteShopModal
        shop={deleteModal.data}
        isOpen={deleteModal.isOpen}
        onClose={setCloseDelete}
      />
    </>
  );
};
