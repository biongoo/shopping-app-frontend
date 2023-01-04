import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ShareIcon from '@mui/icons-material/Share';
import { ListItemIcon, MenuItem, Popover } from '@mui/material';
import { IconButton, TranslatedText } from '~/bits';
import { ListModal } from '~/partials';
import { List, ModifyData } from '~/types';
import { useModal } from '~/utils';
import { DeleteListModal } from './delete-list-modal';
import { ShareListModal } from './share-list-modal';

type Props = {
  list: List;
};

export const ModifyList = (props: Props) => {
  const [options, setOpenOptions, setCloseOptions] =
    useModal<Omit<ModifyData, 'id'>>();
  const [editModal, setOpenEdit, setCloseEdit] = useModal<List>();
  const [shareModal, setOpenShare, setCloseShare] = useModal<List>();
  const [deleteModal, setOpenDelete, setCloseDelete] = useModal<List>();

  const handleOpenEdit = () => {
    setCloseOptions();
    setOpenEdit(props.list);
  };

  const handleOpenShare = () => {
    setCloseOptions();
    setOpenShare(props.list);
  };

  const handleOpenDelete = () => {
    setCloseOptions();
    setOpenDelete(props.list);
  };

  const optionsContent =
    options.isRender && options.data ? (
      <Popover
        open={options.isOpen}
        anchorEl={options.data.element}
        onClose={setCloseOptions}
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
        <MenuItem onClick={handleOpenShare}>
          <ListItemIcon>
            <ShareIcon />
          </ListItemIcon>
          <TranslatedText ml={1} textKey="share" />
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
    ) : null;

  const editContent =
    editModal.isRender && editModal.data ? (
      <ListModal
        list={editModal.data}
        isOpen={editModal.isOpen}
        onClose={setCloseEdit}
      />
    ) : null;

  const deleteContent =
    deleteModal.isRender && deleteModal.data ? (
      <DeleteListModal
        list={deleteModal.data}
        isOpen={deleteModal.isOpen}
        onClose={setCloseDelete}
      />
    ) : null;

  const shareContent =
    shareModal.isRender && shareModal.data ? (
      <ShareListModal
        list={shareModal.data}
        isOpen={shareModal.isOpen}
        onClose={setCloseShare}
      />
    ) : null;

  return (
    <>
      <IconButton
        titleKey="options"
        open={options.isOpen}
        onClick={(e) =>
          setOpenOptions({
            element: e.currentTarget,
          })
        }
      >
        <MoreVertIcon />
      </IconButton>
      {optionsContent}
      {editContent}
      {deleteContent}
      {shareContent}
    </>
  );
};
