import { useMutation } from '@tanstack/react-query';
import { deleteSectionProduct } from '~/api';
import { AlertModal, TranslatedText } from '~/bits';
import { QueryKey } from '~/enums';
import { Product } from '~/types';
import { generateOnError, generateOnSuccess, useClearCache } from '~/utils';

type Props = {
  isOpen: boolean;
  product: Product;
  onClose: () => void;
};

export const DeleteSectionProductModal = (props: Props) => {
  const { product, isOpen, onClose } = props;
  const clearCache = useClearCache(QueryKey.sectionProducts);
  const mutation = useMutation({ mutationFn: deleteSectionProduct });

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
          clearCache();
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
      isLoading={mutation.isPending}
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
