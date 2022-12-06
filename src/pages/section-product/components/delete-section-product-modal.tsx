import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteSectionProduct } from '~/api';
import { AlertModal, TranslatedText } from '~/bits';
import { Product } from '~/types';
import { generateOnError, generateOnSuccess } from '~/utils';

type Props = {
  isOpen: boolean;
  product: Product;
  onClose: () => void;
};

export const DeleteSectionProductModal = (props: Props) => {
  const { product, isOpen, onClose } = props;
  const queryClient = useQueryClient();
  const mutation = useMutation(deleteSectionProduct);

  const handleSubmit = () => {
    const data = {
      id: product.id,
      sectionId: product.sectionId ?? 0,
    };

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
      titleKey="deleteSectionProduct"
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
