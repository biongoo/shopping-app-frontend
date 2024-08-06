import { useMutation } from '@tanstack/react-query';
import { deleteShop } from '~/api';
import { AlertModal, TranslatedText } from '~/bits';
import { QueryKey } from '~/enums';
import { Shop } from '~/types';
import { generateOnError, generateOnSuccess, useClearCache } from '~/utils';

type DeleteShopModalProps = {
  shop: Shop;
  isOpen: boolean;
  onClose: () => void;
};

export const DeleteShopModal = (props: DeleteShopModalProps) => {
  const { shop, isOpen, onClose } = props;
  const mutation = useMutation({ mutationFn: deleteShop });
  const clearCache = useClearCache(QueryKey.shops);

  const handleSubmit = () => {
    const data = { shopId: shop.id };

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
      titleKey="deleteShop"
      isOpen={isOpen}
      isLoading={mutation.isPending}
      onClose={onClose}
      onOk={handleSubmit}
    >
      <TranslatedText
        textKey="areYouSureDelete"
        options={{ item: shop.name }}
      />
    </AlertModal>
  );
};
