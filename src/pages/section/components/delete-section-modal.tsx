import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteSection } from '~/api';
import { AlertModal, TranslatedText } from '~/bits';
import { Section } from '~/types';
import { generateOnError, generateOnSuccess } from '~/utils';

type DeleteSectionModalProps = {
  isOpen: boolean;
  section: Section;
  onClose: () => void;
};

export const DeleteSectionModal = (props: DeleteSectionModalProps) => {
  const { section, isOpen, onClose } = props;
  const queryClient = useQueryClient();
  const mutation = useMutation(deleteSection);

  const handleSubmit = () => {
    const data = { id: section.id, shopId: section.shopId };

    mutation.mutate(data, {
      onSuccess: generateOnSuccess({
        alertTime: 5,
        message: 'successfullyDeleted',
        fn: () => {
          queryClient.invalidateQueries({ queryKey: ['products'] });
          queryClient.invalidateQueries({ queryKey: ['sections'] });
          queryClient.invalidateQueries({ queryKey: ['section-products'] });
          onClose();
        },
      }),
      onError: generateOnError(),
    });
  };

  return (
    <AlertModal
      titleKey="deleteSection"
      isOpen={isOpen}
      isLoading={mutation.isLoading}
      onClose={onClose}
      onOk={handleSubmit}
    >
      <TranslatedText
        textKey="areYouSureDelete"
        options={{ item: section.name }}
      />
    </AlertModal>
  );
};
