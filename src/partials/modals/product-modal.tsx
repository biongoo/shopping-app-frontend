import { Box, CircularProgress, Stack } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm, UseFormReset, UseFormSetError } from 'react-hook-form';
import {
  addProduct,
  editProduct,
  getSectionProducts,
  getSections,
  getShops,
  PostProductDto,
} from '~/api';
import { Autocomplete, FormModal, Input, ToggleButtonGroup } from '~/bits';
import { OrderType, ProductType, QueryKey, Unit } from '~/enums';
import { ApiData } from '~/models';
import { AddSectionModal, AddShopModal } from '~/partials';
import { Product } from '~/types';
import {
  generateOnError,
  generateOnSuccess,
  useClearCache,
  useExistsItem,
  useModal,
} from '~/utils';

type Props = {
  isOpen: boolean;
  product?: Product;
  defaultName?: string;
  withoutShop?: boolean;
  onHide: () => void;
  onOpen: () => void;
  onClose: (productId?: number) => void;
};

type ProductInputs = {
  name: string;
  units: Unit[];
  shopId: number | null;
  sectionId: number | null;
  orderType: OrderType | null;
  orderAfterId: number | null;
};

type OnSubmitProps = {
  data: PostProductDto;
  fn: (data: ApiData<Product>, variables: PostProductDto) => void;
  reset: UseFormReset<ProductInputs>;
  setError: UseFormSetError<ProductInputs>;
};

type ProductModalProps = Props & {
  isLoading: boolean;
  onSubmitForm: (props: OnSubmitProps) => void;
};

export const AddProductModal = (props: Props) => {
  const mutation = useMutation(addProduct);

  const handleSubmit = (onSubmitProps: OnSubmitProps) => {
    mutation.mutate(onSubmitProps.data, {
      onSuccess: generateOnSuccess({
        alertTime: 5,
        message: 'successfullyAdded',
        reset: onSubmitProps.reset,
        fn: onSubmitProps.fn,
      }),
      onError: generateOnError({ setError: onSubmitProps.setError }),
    });
  };

  return (
    <ProductModal
      {...props}
      onSubmitForm={handleSubmit}
      isLoading={mutation.isLoading}
    />
  );
};

export const EditProductModal = (props: Props) => {
  const { product, onClose } = props;
  const mutation = useMutation(editProduct);

  if (product === undefined) {
    onClose();
    return null;
  }

  const handleSubmit = (onSubmitProps: OnSubmitProps) => {
    const preparedData = {
      ...onSubmitProps.data,
      id: product.id,
      type: product.type,
    };

    mutation.mutate(preparedData, {
      onSuccess: generateOnSuccess({
        alertTime: 5,
        message: 'successfullyEdited',
        reset: onSubmitProps.reset,
        fn: onSubmitProps.fn,
      }),
      onError: generateOnError({ setError: onSubmitProps.setError }),
    });
  };

  return (
    <ProductModal
      {...props}
      onSubmitForm={handleSubmit}
      isLoading={mutation.isLoading}
    />
  );
};

const ProductModal = (props: ProductModalProps) => {
  const {
    isOpen,
    product,
    isLoading,
    defaultName,
    withoutShop,
    onClose,
    onHide,
    onOpen,
    onSubmitForm,
  } = props;
  const clearCache = useClearCache(QueryKey.products);
  const [shopModal, setOpenShop, setCloseShop] = useModal<string>();
  const [sectionModal, setOpenSection, setCloseSection] = useModal<string>();
  const { control, reset, watch, setError, setValue, getValues, handleSubmit } =
    useForm<ProductInputs>({
      defaultValues: {
        name: product?.name ?? defaultName ?? '',
        units: product?.units ?? [],
        shopId: product?.shopId ?? null,
        sectionId: product?.sectionId ?? null,
      },
    });

  const shopId = watch('shopId');
  const sectionId = watch('sectionId');
  const orderType = watch('orderType');

  const isShop = typeof shopId === 'number';
  const isSection = typeof sectionId === 'number';
  const { shops, sections, sectionProducts } = useQueries(
    shopId,
    sectionId,
    withoutShop
  );
  const sectionProduct = sectionProducts.data.find((x) => x.id === product?.id);

  useEffect(() => {
    if (!isSection) {
      setValue('orderType', null);
      setValue('orderAfterId', null);
      return;
    }

    setValue('orderType', sectionProduct?.orderType ?? OrderType.atTheBottom, {
      shouldValidate: true,
    });

    setValue('orderAfterId', sectionProduct?.orderAfterId ?? null, {
      shouldValidate: Boolean(sectionProduct?.orderAfterId),
    });
  }, [sectionId, sectionProduct]);

  useEffect(() => {
    if (getValues('orderAfterId') === (sectionProduct?.orderAfterId ?? null)) {
      return;
    }

    setValue('orderAfterId', sectionProduct?.orderAfterId ?? null, {
      shouldValidate: Boolean(sectionProduct?.orderAfterId),
    });
  }, [orderType]);

  const [shopIdToUpdate, setShopIdToUpdate] = useExistsItem(shops.data, (x) =>
    setValue('shopId', x, { shouldValidate: true })
  );

  const [sectionIdToUpdate, setSectionIdToUpdate] = useExistsItem(
    sections.data,
    (x) => setValue('sectionId', x, { shouldValidate: true })
  );

  const handleOpenShop = (name: string) => {
    onHide();
    setTimeout(() => setOpenShop(name), 200);
  };

  const handleCloseShop = (shopId?: number) => {
    setCloseShop();
    setShopIdToUpdate(shopId);
    setTimeout(onOpen, 200);
  };

  const handleOpenSection = (name: string) => {
    onHide();
    setTimeout(() => setOpenSection(name), 200);
  };

  const handleCloseSection = (sectionId?: number) => {
    setCloseSection();
    setSectionIdToUpdate(sectionId);
    setTimeout(onOpen, 200);
  };

  const handleChangeShopId = () => {
    setValue('sectionId', null);
  };

  const onSubmit = (data: ProductInputs) => {
    const preparedData = {
      name: data.name,
      units: data.units,
      sectionId: data.sectionId ?? undefined,
      orderType: data.orderType ?? undefined,
      orderAfterId: data.orderAfterId ?? undefined,
    };

    onSubmitForm({
      data: preparedData,
      reset,
      setError,
      fn: ({ data }) => {
        clearCache();
        onClose(data.id);
      },
    });
  };

  const shopInput =
    withoutShop === true ? null : (
      <Autocomplete
        name="shopId"
        titleKey="shopOptional"
        required={false}
        control={control}
        onChangeId={handleChangeShopId}
        dynamicAdd={{
          defaultValue: -1,
          emptyAddKey: 'addShop',
          onAddNewItem: handleOpenShop,
        }}
        isInitialFetching={
          shops.isInitialLoading || shopIdToUpdate !== undefined
        }
        options={shops.data.map((x) => ({
          value: x.id,
          label: x.name,
        }))}
      />
    );

  const sectionsInput = isShop ? (
    <Autocomplete
      required={true}
      name="sectionId"
      control={control}
      titleKey="section"
      dynamicAdd={{
        defaultValue: -1,
        emptyAddKey: 'addSection',
        onAddNewItem: handleOpenSection,
      }}
      isInitialFetching={
        sections.isInitialLoading || sectionIdToUpdate !== undefined
      }
      options={sections.data.map((x) => ({
        value: x.id,
        label: x.name,
      }))}
    />
  ) : null;

  const orderTypeInput = isSection ? (
    sectionProducts.isInitialLoading ? (
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    ) : (
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
    )
  ) : null;

  const orderAfterIdInput =
    isSection && orderType === OrderType.afterItem ? (
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

  const addShopContent = shopModal.isRender ? (
    <AddShopModal
      isOpen={shopModal.isOpen}
      defaultName={shopModal.data}
      onClose={handleCloseShop}
    />
  ) : null;

  const addSectionContent =
    sectionModal.isRender && isShop ? (
      <AddSectionModal
        shopId={shopId}
        isOpen={sectionModal.isOpen}
        defaultName={sectionModal.data}
        onClose={handleCloseSection}
      />
    ) : null;

  return (
    <>
      <FormModal
        isOpen={isOpen}
        isLoading={isLoading}
        titleKey={product ? 'editProduct' : 'addProduct'}
        reset={reset}
        onClose={onClose}
        handleSubmit={handleSubmit(onSubmit)}
      >
        <Stack spacing={2} direction="column">
          <Input
            name="name"
            labelKey="name"
            control={control}
            disabled={product?.type === ProductType.global}
          />
          <ToggleButtonGroup
            fullWidth
            name="units"
            multiple={true}
            titleKey="units"
            control={control}
            translationKey="unit"
            disabled={product?.type === ProductType.global}
            options={[Unit.grams, Unit.milliliters, Unit.packs, Unit.pieces]}
          />
          {shopInput}
          {sectionsInput}
          {orderTypeInput}
          {orderAfterIdInput}
        </Stack>
      </FormModal>
      {addShopContent}
      {addSectionContent}
    </>
  );
};

const useQueries = (
  shopId: number | null,
  sectionId: number | null,
  withoutShop?: boolean
) => {
  const isShop = typeof shopId === 'number';
  const isSection = typeof sectionId === 'number';

  const shopsQuery = useQuery({
    queryKey: [QueryKey.shops],
    queryFn: getShops,
    onError: generateOnError(),
    enabled: withoutShop !== true,
  });

  const sectionsQuery = useQuery({
    queryKey: [QueryKey.sections],
    queryFn: () => (isShop ? getSections({ shopId }) : undefined),
    onError: generateOnError(),
    enabled: isShop,
  });

  const sectionProductsQuery = useQuery({
    queryKey: [QueryKey.sectionProducts, sectionId],
    queryFn: () => (isSection ? getSectionProducts({ sectionId }) : undefined),
    onError: generateOnError(),
    enabled: isSection,
  });

  const shops = shopsQuery.data?.data ?? [];
  const sections = sectionsQuery.data?.data ?? [];
  const sectionProducts = sectionProductsQuery.data?.data ?? [];

  return {
    shops: {
      data: shops,
      isInitialLoading: shopsQuery.isInitialLoading,
    },
    sections: {
      data: sections,
      isInitialLoading: sectionsQuery.isInitialLoading,
    },
    sectionProducts: {
      data: sectionProducts,
      isInitialLoading: sectionProductsQuery.isInitialLoading,
    },
  };
};
