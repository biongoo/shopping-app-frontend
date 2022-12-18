import DashboardIcon from '@mui/icons-material/Dashboard';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { ListItemIcon, MenuItem, Popover } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { TranslatedText } from '~/bits';
import { OrderType } from '~/enums';
import { EditShopModal } from '~/partials';
import { ModifyData, Shop } from '~/types';
import { useModal } from '~/utils';
import { DeleteShopModal } from './delete-shop-modal';

type Props = {
  shops: Shop[];
  isOpen: boolean;
  data: ModifyData;
  onHide: () => void;
  onClose: () => void;
};

export const ModifyShop = (props: Props) => {
  const navigate = useNavigate();
  const [editModal, setOpenEdit, setCloseEdit] = useModal<Shop>();
  const [deleteModal, setOpenDelete, setCloseDelete] = useModal<Shop>();

  const shop = props.shops.find((x) => x.id === props.data.id);

  if (!shop) {
    props.onClose();
    return null;
  }

  const handleOpenEdit = () => {
    props.onHide();

    let orderType: OrderType | undefined;
    let orderAfterId: number | undefined;

    if (shop.order === 1) {
      orderType = OrderType.atTheTop;
    } else if (shop.order === props.shops.length) {
      orderType = OrderType.atTheBottom;
    } else {
      orderType = OrderType.afterItem;
      orderAfterId = props.shops.find((x) => x.order === shop.order - 1)?.id;
    }

    setOpenEdit({ ...shop, orderType, orderAfterId });
  };

  const handleCloseEdit = () => {
    setCloseEdit();
    props.onClose();
  };

  const handleOpenDelete = () => {
    props.onHide();
    setOpenDelete(shop);
  };

  const handleCloseDelete = () => {
    setCloseDelete();
    props.onClose();
  };

  const editContent =
    editModal.isRender && editModal.data ? (
      <EditShopModal
        shop={editModal.data}
        isOpen={editModal.isOpen}
        onClose={handleCloseEdit}
      />
    ) : null;

  const deleteContent =
    deleteModal.isRender && deleteModal.data ? (
      <DeleteShopModal
        shop={deleteModal.data}
        isOpen={deleteModal.isOpen}
        onClose={handleCloseDelete}
      />
    ) : null;

  return (
    <>
      <Popover
        open={props.isOpen}
        anchorEl={props.data.element}
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
        <MenuItem onClick={() => navigate(`/app/shop/${props.data.id}`)}>
          <ListItemIcon>
            <DashboardIcon />
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
      {editContent}
      {deleteContent}
    </>
  );
};
