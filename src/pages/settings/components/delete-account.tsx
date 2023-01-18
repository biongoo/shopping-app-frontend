import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useMutation } from '@tanstack/react-query';
import { deleteAccount } from '~/api';
import { AlertModal, IconButton, TranslatedText } from '~/bits';
import { useAuthStore } from '~/stores';
import { generateOnError, generateOnSuccess, useModal } from '~/utils';

type DeleteAccountModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const DeleteAccountModal = (props: DeleteAccountModalProps) => {
  const { isOpen, onClose } = props;
  const mutation = useMutation(deleteAccount);
  const logOut = useAuthStore((store) => store.logOut);

  const handleSubmit = () => {
    mutation.mutate(undefined, {
      onSuccess: generateOnSuccess({
        alertTime: 5,
        message: 'successfullyDeleted',
        fn: logOut,
      }),
      onError: generateOnError(),
    });
  };

  return (
    <AlertModal
      titleKey="deleteAccount"
      isOpen={isOpen}
      isLoading={mutation.isLoading}
      onClose={onClose}
      onOk={handleSubmit}
    >
      <TranslatedText textKey="areYouSureDeleteAccount" />
    </AlertModal>
  );
};

export const DeleteAccount = () => {
  const [modal, setOpen, setClose] = useModal();

  const content = modal.isRender ? (
    <DeleteAccountModal isOpen={modal.isOpen} onClose={setClose} />
  ) : null;

  return (
    <>
      <IconButton
        open={true}
        color="error.main"
        titleKey="deleteAccount"
        onClick={() => setOpen()}
      >
        <DeleteForeverIcon />
      </IconButton>
      {content}
    </>
  );
};
