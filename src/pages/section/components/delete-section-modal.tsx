import { useMutation } from '@tanstack/react-query';
import { deleteSection } from '~/api';
import { AlertModal, TranslatedText } from '~/bits';
import { QueryKey } from '~/enums';
import { Section } from '~/types';
import { generateOnError, generateOnSuccess, useClearCache } from '~/utils';

type DeleteSectionModalProps = {
  isOpen: boolean;
  section: Section;
  onClose: () => void;
};

export const DeleteSectionModal = (props: DeleteSectionModalProps) => {
  const { section, isOpen, onClose } = props;
  const mutation = useMutation(deleteSection);
  const clearCache = useClearCache(QueryKey.sections);

  const handleSubmit = () => {
    const data = { id: section.id, shopId: section.shopId };

    mutation.mutate(data, {
      onSuccess: generateOnSuccess({
        alertTime: 5,
        message: 'successfullyDeleted',
        fn: () => {
          clearCache();
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
