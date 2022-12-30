import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { ListItemIcon, MenuItem, Popover } from '@mui/material';
import { useEffect } from 'react';
import { TranslatedText } from '~/bits';
import { ListItemModal } from '~/partials';
import { ListItem, ModifyData } from '~/types';
import { useModal } from '~/utils';
import { DeleteListItemModal } from './delete-list-item-modal';

type Props = {
  listId: number;
  isOpen: boolean;
  data: ModifyData;
  listItems: ListItem[];
  onHide: () => void;
  onClose: () => void;
};

export const ModifyListItem = (props: Props) => {
  const { data, listId, isOpen, listItems, onHide, onClose } = props;
  const [editModal, setOpenEdit, setCloseEdit, setHideEdit, setEditData] =
    useModal<ListItem>();
  const [deleteModal, setOpenDelete, setCloseDelete] = useModal<ListItem>();

  const listItem = listItems.find((x) => x.id === data.id);

  useEffect(() => {
    if (editModal.isRender) {
      setEditData(listItem);
    }
  }, [listItem?.sectionId]);

  if (!listItem) {
    return null;
  }

  const handleOpenEdit = () => {
    onHide();
    setOpenEdit(listItem);
  };

  const handleOpenDelete = () => {
    onHide();
    setOpenDelete(listItem);
  };

  const handleCloseEdit = () => {
    setCloseEdit();
    onClose();
  };

  const handleCloseDelete = () => {
    setCloseDelete();
    onClose();
  };

  const editContent =
    editModal.isRender && editModal.data ? (
      <ListItemModal
        listId={listId}
        listItem={listItem}
        onHide={setHideEdit}
        onOpen={setOpenEdit}
        isOpen={editModal.isOpen}
        onClose={handleCloseEdit}
      />
    ) : null;

  const deleteContent =
    deleteModal.isRender && deleteModal.data ? (
      <DeleteListItemModal
        listItem={deleteModal.data}
        isOpen={deleteModal.isOpen}
        onClose={handleCloseDelete}
      />
    ) : null;

  const popoverContent = (
    <>
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
    </>
  );

  return (
    <>
      <Popover
        open={isOpen}
        anchorEl={data.element}
        onClose={onClose}
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
        {popoverContent}
      </Popover>
      {editContent}
      {deleteContent}
    </>
  );
};
