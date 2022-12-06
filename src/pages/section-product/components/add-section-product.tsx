import AddIcon from '@mui/icons-material/Add';
import { IconButton } from '~/bits';
import { SectionProductModal } from '~/partials';
import { useModal } from '~/utils';

type Props = {
  sectionId: number;
  isReordering: boolean;
};

export const AddSectionProduct = (props: Props) => {
  const [modal, setOpen, setClose, setHide] = useModal();

  const content = modal.isRender ? (
    <SectionProductModal
      isOpen={modal.isOpen}
      sectionId={props.sectionId}
      onOpen={setOpen}
      onHide={setHide}
      onClose={setClose}
    />
  ) : null;

  return (
    <>
      <IconButton
        open={modal.isOpen}
        disabled={props.isReordering}
        titleKey="addSectionProduct"
        onClick={() => setOpen()}
      >
        <AddIcon />
      </IconButton>
      {content}
    </>
  );
};
