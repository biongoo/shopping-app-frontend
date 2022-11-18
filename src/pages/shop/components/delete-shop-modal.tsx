import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteShop } from '~/api';
import { AlertModal, TranslatedText } from '~/bits';
import { Shop } from '~/types';
import { generateOnError, generateOnSuccess } from '~/utils';

type DeleteShopModalProps = {
  shop: Shop;
  isOpen: boolean;
  onClose: () => void;
};

export const DeleteShopModal = (props: DeleteShopModalProps) => {
  const { shop, isOpen, onClose } = props;
  const queryClient = useQueryClient();
  const mutation = useMutation(deleteShop);

  const handleSubmit = () => {
    const data = { shopId: shop.id };

    mutation.mutate(data, {
      onSuccess: generateOnSuccess({
        alertTime: 5,
        message: 'successfullyDeleted',
        fn: () => {
          queryClient.invalidateQueries({ queryKey: ['shops'] });
          onClose();
        },
      }),
      onError: generateOnError(),
    });
  };

  return (
    <AlertModal
      titleKey="deleteShop"
      isOpen={isOpen}
      isLoading={mutation.isLoading}
      onClose={onClose}
      onOk={handleSubmit}
    >
      <TranslatedText
        textKey="areYouSureDelete"
        options={{ item: shop?.name ?? '' }}
      />
    </AlertModal>
  );
};
