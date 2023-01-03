import AddIcon from '@mui/icons-material/Add';
import { IconButton } from '~/bits';
import { useModal } from '~/utils';
import { ListModal } from '~/partials';

export const AddList = () => {
  const [modal, setOpen, setClose] = useModal();

  const content = modal.isRender ? (
    <ListModal isOpen={modal.isOpen} onClose={setClose} />
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
