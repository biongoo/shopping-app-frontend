import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteShop } from '~/api';
import { AlertModal, TranslatedText } from '~/bits';
import { Shop } from '~/types';
import { generateOnError, generateOnSuccess } from '~/utils';

type EditShopModalProps = {
  shop?: Shop;
  isOpen: boolean;
  onClose: () => void;
};

export const DeleteShopModal = (props: EditShopModalProps) => {
  const { shop, isOpen, onClose } = props;

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteShop,
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

  const handleSubmit = () => {
    if (!shop?.id) {
      onClose();
      return;
    }

    mutation.mutate({ shopId: shop.id });
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
