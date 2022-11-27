import AddIcon from '@mui/icons-material/Add';
import { IconButton } from '~/bits';
import { AddProductModal } from '~/partials';
import { useModal } from '~/utils';

export const AddProduct = () => {
  const [modal, setOpen, setClose, setHide] = useModal();

  const content = modal.isRender ? (
    <AddProductModal
      isOpen={modal.isOpen}
      onHide={setHide}
      onOpen={setOpen}
      onClose={setClose}
    />
  ) : null;

  return (
    <>
      <IconButton
        open={modal.isOpen}
        titleKey="addProduct"
        onClick={() => setOpen()}
      >
        <AddIcon />
      </IconButton>
      {content}
    </>
  );
};
