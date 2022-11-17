import AddIcon from '@mui/icons-material/Add';
import { IconButton } from '~/bits';
import { Shop } from '~/types';
import { useModal } from '~/utils';
import { AddShopModal } from './add-shop-modal';

type Props = {
  shops: Shop[];
  isReordering: boolean;
};

export const AddShop = (props: Props) => {
  const [modal, setOpen, setClose] = useModal();

  const content = modal.isRender ? (
    <AddShopModal
      shops={props.shops}
      isOpen={modal.isOpen}
      onClose={setClose}
    />
  ) : null;

  return (
    <>
      <IconButton
        open={modal.isOpen}
        disabled={props.isReordering}
        titleKey="addShop"
        onClick={() => setOpen()}
      >
        <AddIcon />
      </IconButton>
      {content}
    </>
  );
};
