import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteProduct } from '~/api';
import { AlertModal, TranslatedText } from '~/bits';
import { Product } from '~/types';
import { generateOnError, generateOnSuccess } from '~/utils';

type DeleteProductModalProps = {
  isOpen: boolean;
  product: Product;
  onClose: () => void;
};

export const DeleteProductModal = (props: DeleteProductModalProps) => {
  const { product, isOpen, onClose } = props;
  const queryClient = useQueryClient();
  const mutation = useMutation(deleteProduct);

  const handleSubmit = () => {
    const data = { id: product.id };

    mutation.mutate(data, {
      onSuccess: generateOnSuccess({
        alertTime: 5,
        message: 'successfullyDeleted',
        fn: () => {
          queryClient.invalidateQueries({ queryKey: ['products'] });
          queryClient.invalidateQueries({ queryKey: ['section-products'] });
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
        options={{ item: product.name }}
      />
    </AlertModal>
  );
};
