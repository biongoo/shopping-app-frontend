import CategoryIcon from '@mui/icons-material/Category';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { ListItemIcon, MenuItem, Popover } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { TranslatedText } from '~/bits';
import { OrderType } from '~/enums';
import { EditSectionModal } from '~/partials';
import { ModifyData, Section } from '~/types';
import { useModal } from '~/utils';
import { DeleteSectionModal } from './delete-section-modal';

type Props = {
  isOpen: boolean;
  data: ModifyData;
  sections: Section[];
  onHide: () => void;
  onClose: () => void;
};

export const ModifySection = (props: Props) => {
  const navigate = useNavigate();
  const [editModal, setOpenEdit, setCloseEdit] = useModal<Section>();
  const [deleteModal, setOpenDelete, setCloseDelete] = useModal<Section>();

  const section = props.sections.find((x) => x.id === props.data.id);

  if (!section) {
    return null;
  }

  const handleOpenEdit = () => {
    props.onHide();

    let orderType: OrderType | undefined;
    let orderAfterId: number | undefined;

    if (section.order === 1) {
      orderType = OrderType.atTheTop;
    } else if (section.order === props.sections.length) {
      orderType = OrderType.atTheBottom;
    } else {
      orderType = OrderType.afterItem;
      orderAfterId = props.sections.find(
        (x) => x.order === section.order - 1
      )?.id;
    }

    setOpenEdit({ ...section, orderType, orderAfterId });
  };

  const handleCloseEdit = () => {
    setCloseEdit();
    props.onClose();
  };

  const handleOpenDelete = () => {
    props.onHide();
    setOpenDelete(section);
  };

  const handleCloseDelete = () => {
    setCloseDelete();
    props.onClose();
  };

  const editContent =
    editModal.isRender && editModal.data ? (
      <EditSectionModal
        section={editModal.data}
        isOpen={editModal.isOpen}
        shopId={editModal.data.shopId}
        onClose={handleCloseEdit}
      />
    ) : null;

  const deleteContent =
    deleteModal.isRender && deleteModal.data ? (
      <DeleteSectionModal
        section={deleteModal.data}
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
        <MenuItem
          onClick={() =>
            navigate(`/app/shop/${section.shopId}/${props.data.id}`)
          }
        >
          <ListItemIcon>
            <CategoryIcon />
          </ListItemIcon>
          <TranslatedText ml={1} textKey="products" />
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
