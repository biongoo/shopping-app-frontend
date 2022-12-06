import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { ListItemIcon, MenuItem, Popover } from '@mui/material';
import { TranslatedText } from '~/bits';
import { SectionProductModal } from '~/partials';
import { ModifyData, ProductWithOrder } from '~/types';
import { useModal } from '~/utils';
import { DeleteSectionProductModal } from './delete-section-product-modal';

type Props = {
  isOpen: boolean;
  data: ModifyData;
  products: ProductWithOrder[];
  onHide: () => void;
  onClose: () => void;
};

export const ModifySectionProduct = (props: Props) => {
  const { data, isOpen, products, onHide, onClose } = props;
  const [editModal, setOpenEdit, setCloseEdit, setHideEdit] =
    useModal<ProductWithOrder>();
  const [deleteModal, setOpenDelete, setCloseDelete] =
    useModal<ProductWithOrder>();

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
      <SectionProductModal
        product={product}
        isOpen={editModal.isOpen}
        sectionId={product.sectionId}
        onHide={setHideEdit}
        onOpen={setOpenEdit}
        onClose={handleCloseEdit}
      />
    ) : null;

  const deleteContent =
    deleteModal.isRender && deleteModal.data ? (
      <DeleteSectionProductModal
        product={deleteModal.data}
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
