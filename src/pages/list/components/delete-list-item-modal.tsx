import { useMutation } from '@tanstack/react-query';
import { deleteListItem } from '~/api';
import { AlertModal, TranslatedText } from '~/bits';
import { QueryKey } from '~/enums';
import { ListItem } from '~/types';
import { generateOnError, generateOnSuccess, useClearCache } from '~/utils';

type Props = {
  isOpen: boolean;
  listItem: ListItem;
  onClose: () => void;
};

export const DeleteListItemModal = (props: Props) => {
  const { listItem, isOpen, onClose } = props;
  const mutation = useMutation(deleteListItem);
  const clearCache = useClearCache(QueryKey.lists);

  const handleSubmit = () => {
    const data = { id: listItem.id };

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
      titleKey="deleteProduct"
      isOpen={isOpen}
      isLoading={mutation.isLoading}
      onClose={onClose}
      onOk={handleSubmit}
    >
      <TranslatedText
        textKey="areYouSureDelete"
        options={{ item: listItem.name }}
      />
    </AlertModal>
  );
};
