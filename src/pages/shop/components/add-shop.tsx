import AddIcon from '@mui/icons-material/Add';
import { IconButton } from '~/bits';
import { AddShopModal } from '~/partials';
import { useModal } from '~/utils';

type Props = {
  isReordering: boolean;
};

export const AddShop = (props: Props) => {
  const [modal, setOpen, setClose] = useModal();

  const content = modal.isRender ? (
    <AddShopModal isOpen={modal.isOpen} onClose={setClose} />
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
