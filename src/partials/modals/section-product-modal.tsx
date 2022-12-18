import { Stack } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  getAvailableProducts,
  getSectionProductsWithShop,
  putSectionProduct,
} from '~/api';
import { Autocomplete, FormModal, ToggleButtonGroup } from '~/bits';
import { OrderType, QueryKey } from '~/enums';
import { Product } from '~/types';
import {
  generateOnError,
  generateOnSuccess,
  useClearCache,
  useExistsItem,
  useModal,
} from '~/utils';
import { AddProductModal } from './product-modal';

type Props = {
  isOpen: boolean;
  sectionId: number;
  product?: Product;
  onHide: () => void;
  onOpen: () => void;
  onClose: () => void;
};

type SectionProductInputs = {
  orderType: OrderType;
  productId: number | null;
  orderAfterId: number | null;
};

export const SectionProductModal = (props: Props) => {
  const { isOpen, product, sectionId, onClose, onHide, onOpen } = props;
  const isProduct = product !== undefined;
  const mutation = useMutation(putSectionProduct);
  const clearCache = useClearCache(QueryKey.sectionProducts);
  const [productModal, setOpenProduct, setCloseProduct, setHideProduct] =
    useModal<string>();

  const { control, reset, watch, setError, setValue, getValues, handleSubmit } =
    useForm<SectionProductInputs>({
      defaultValues: {
        productId: product?.id,
        orderAfterId: product?.orderAfterId ?? null,
        orderType: product?.orderType ?? OrderType.atTheBottom,
      },
    });

  const productId = watch('productId');
  const orderType = watch('orderType');
  const { availableProducts, sectionProducts } = useQueries(
    sectionId,
    isProduct
  );

  useEffect(() => {
    setValue('orderType', OrderType.atTheBottom);
    setValue('orderAfterId', null);
  }, [productId]);

  useEffect(() => {
    if (getValues('orderAfterId') === (product?.orderAfterId ?? null)) {
      return;
    }

    setValue('orderAfterId', product?.orderAfterId ?? null, {
      shouldValidate: Boolean(product?.orderAfterId),
    });
  }, [orderType]);

  const [productIdToUpdate, setProductIdToUpdate] = useExistsItem(
    availableProducts.data,
    (x) => setValue('productId', x, { shouldValidate: true })
  );

  const handleOpenProduct = (name: string) => {
    onHide();
    setTimeout(() => setOpenProduct(name), 200);
  };

  const handleCloseProduct = (productId?: number) => {
    setCloseProduct();
    setProductIdToUpdate(productId);
    setTimeout(onOpen, 200);
  };

  const onSubmit = (data: SectionProductInputs) => {
    const preparedData = {
      sectionId,
      id: data.productId ?? 0,
      orderType: data.orderType,
      orderAfterId: data.orderAfterId ?? undefined,
    };

    mutation.mutate(preparedData, {
      onSuccess: generateOnSuccess({
        alertTime: 5,
        message: isProduct ? 'successfullyEdited' : 'successfullyAdded',
        reset,
        fn: () => {
          clearCache();
          onClose();
        },
      }),
      onError: generateOnError({ setError }),
    });
  };

  const productsInput = isProduct ? null : (
    <Autocomplete
      required={true}
      name="productId"
      control={control}
      titleKey="product"
      dynamicAdd={{
        defaultValue: -1,
        emptyAddKey: 'addProduct',
        onAddNewItem: handleOpenProduct,
      }}
      isInitialFetching={
        availableProducts.isInitialLoading || productIdToUpdate !== undefined
      }
      options={availableProducts.data.map((x) => ({
        value: x.id,
        label: x.name,
      }))}
    />
  );

  const orderAfterIdInput =
    orderType === OrderType.afterItem ? (
      <Autocomplete
        required={true}
        control={control}
        titleKey="product"
        name="orderAfterId"
        isInitialFetching={sectionProducts.isInitialLoading}
        options={sectionProducts.data.map((x) => ({
          value: x.id,
          label: x.name,
        }))}
      />
    ) : null;

  const addProductContent = productModal.isRender ? (
    <AddProductModal
      withoutShop={true}
      isOpen={productModal.isOpen}
      defaultName={productModal.data}
      onOpen={setOpenProduct}
      onHide={setHideProduct}
      onClose={handleCloseProduct}
    />
  ) : null;

  return (
    <>
      <FormModal
        isOpen={isOpen}
        isLoading={mutation.isLoading}
        titleKey={product ? 'editSectionProduct' : 'addSectionProduct'}
        reset={reset}
        onClose={onClose}
        handleSubmit={handleSubmit(onSubmit)}
      >
        <Stack spacing={2} direction="column">
          {productsInput}
          <ToggleButtonGroup
            fullWidth
            name="orderType"
            control={control}
            titleKey="position"
            translationKey="orderType"
            options={[
              OrderType.atTheTop,
              OrderType.atTheBottom,
              OrderType.afterItem,
            ]}
          />
          {orderAfterIdInput}
        </Stack>
      </FormModal>
      {addProductContent}
    </>
  );
};

const useQueries = (sectionId: number, isProduct: boolean) => {
  const sectionProductsQuery = useQuery({
    queryKey: [QueryKey.sectionProducts, sectionId, { withShop: true }],
    queryFn: () => getSectionProductsWithShop({ sectionId }),
    onError: generateOnError(),
  });

  const availableSectionProductsQuery = useQuery({
    queryKey: [QueryKey.products, sectionId],
    queryFn: () => getAvailableProducts({ sectionId }),
    onError: generateOnError(),
    enabled: !isProduct,
  });

  const sectionProducts = sectionProductsQuery.data?.data.products ?? [];
  const availableProducts = availableSectionProductsQuery.data?.data ?? [];

  return {
    sectionProducts: {
      data: sectionProducts,
      isInitialLoading: sectionProductsQuery.isInitialLoading,
    },
    availableProducts: {
      data: availableProducts,
      isInitialLoading: availableSectionProductsQuery.isInitialLoading,
    },
  };
};
