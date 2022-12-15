import AddIcon from '@mui/icons-material/Add';
import { IconButton } from '~/bits';
import { useModal } from '~/utils';
import { AddListModal } from './add-list-modal';

export const AddList = () => {
  const [modal, setOpen, setClose] = useModal();

  const content = modal.isRender ? (
    <AddListModal isOpen={modal.isOpen} onClose={setClose} />
  ) : null;

  return (
    <>
      <IconButton
        titleKey="addList"
        open={modal.isOpen}
        onClick={() => setOpen()}
      >
        <AddIcon />
      </IconButton>
      {content}
    </>
  );
};
