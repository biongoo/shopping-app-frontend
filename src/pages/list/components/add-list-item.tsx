import AddIcon from '@mui/icons-material/Add';
import { IconButton } from '~/bits';
import { ListItemModal } from '~/partials';
import { useModal } from '~/utils';

type Props = {
  listId: number;
};

export const AddListItem = (props: Props) => {
  const [modal, setOpen, setClose, setHide] = useModal();

  const content = modal.isRender ? (
    <ListItemModal
      listId={props.listId}
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
