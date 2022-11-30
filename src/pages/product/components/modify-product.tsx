import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { ListItemIcon, MenuItem, Popover } from '@mui/material';
import { TranslatedText } from '~/bits';
import { ProductType } from '~/enums';
import { Product } from '~/types';
import { useModal } from '~/utils';
import { DeleteProductModal } from './delete-product-modal';
import { EditProductModal } from './edit-product-modal';

export type ModifyData = {
  id: number;
  element: HTMLElement;
};

type Props = {
  isOpen: boolean;
  data: ModifyData;
  products: Product[];
  onHide: () => void;
  onClose: () => void;
};

export const ModifyProduct = (props: Props) => {
  const { data, isOpen, products, onHide, onClose } = props;
  const [editModal, setOpenEdit, setCloseEdit, setHideEdit] =
    useModal<Product>();
  const [deleteModal, setOpenDelete, setCloseDelete] = useModal<Product>();

  const product = products.find((x) => x.id === data.id);

  if (!product) {
    return null;
  }

  const handleOpenEdit = () => {
    onHide();
    setOpenEdit(product);
  };

  const handleOpenDelete = () => {
    onHide();
    setOpenDelete(product);
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
      <EditProductModal
        product={product}
        onHide={setHideEdit}
        onOpen={setOpenEdit}
        isOpen={editModal.isOpen}
        onClose={handleCloseEdit}
      />
    ) : null;

  const deleteContent =
    deleteModal.isRender && deleteModal.data ? (
      <DeleteProductModal
        product={deleteModal.data}
        isOpen={deleteModal.isOpen}
        onClose={handleCloseDelete}
      />
    ) : null;

  const popoverContent =
    product.type === ProductType.local ? (
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
    ) : (
      <MenuItem onClick={handleOpenEdit}>
        <ListItemIcon>
          <EditIcon />
        </ListItemIcon>
        <TranslatedText ml={1} textKey="edit" />
      </MenuItem>
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
