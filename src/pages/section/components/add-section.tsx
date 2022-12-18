import AddIcon from '@mui/icons-material/Add';
import { IconButton } from '~/bits';
import { AddSectionModal } from '~/partials';
import { useModal } from '~/utils';

type Props = {
  shopId: number;
  isReordering: boolean;
};

export const AddSection = (props: Props) => {
  const [modal, setOpen, setClose] = useModal();

  const content = modal.isRender ? (
    <AddSectionModal
      isOpen={modal.isOpen}
      shopId={props.shopId}
      onClose={setClose}
    />
  ) : null;

  return (
    <>
      <IconButton
        open={modal.isOpen}
        disabled={props.isReordering}
        titleKey="addSection"
        onClick={() => setOpen()}
      >
        <AddIcon />
      </IconButton>
      {content}
    </>
  );
};
