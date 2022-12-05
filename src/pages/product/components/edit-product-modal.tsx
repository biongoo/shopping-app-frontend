import { Box, CircularProgress, Stack } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { editProduct, getSectionProducts, getSections, getShops } from '~/api';
import { Autocomplete, FormModal, Input, ToggleButtonGroup } from '~/bits';
import { OrderType, ProductType, Unit } from '~/enums';
import { AddSectionModal, AddShopModal } from '~/partials';
import { Product } from '~/types';
import {
  generateOnError,
  generateOnSuccess,
  useExistsItem,
  useModal,
} from '~/utils';

type Props = {
  isOpen: boolean;
  product: Product;
  onHide: () => void;
  onOpen: () => void;
  onClose: () => void;
};

type EditProductInputs = {
  name: string;
  units: Unit[];
  shopId: number | null;
  sectionId: number | null;
  orderType: OrderType | null;
  orderAfterId: number | null;
};

export const EditProductModal = (props: Props) => {
  const { isOpen, product, onClose, onHide, onOpen } = props;
  const queryClient = useQueryClient();
  const mutation = useMutation(editProduct);
  const [shopModal, setOpenShop, setCloseShop] = useModal<string>();
  const [sectionModal, setOpenSection, setCloseSection] = useModal<string>();
  const { control, reset, watch, setError, setValue, handleSubmit } =
    useForm<EditProductInputs>({
      defaultValues: {
        name: product.name,
        units: product.units,
        shopId: product.shopId,
        sectionId: product.sectionId,
      },
    });

  const shopId = watch('shopId');
  const sectionId = watch('sectionId');
  const orderType = watch('orderType');

  const { shops, sections, sectionProducts } = useQueries(shopId, sectionId);
  const sectionProduct = sectionProducts.data.find((x) => x.id === product.id);

  useEffect(() => {
    setValue('orderType', sectionProduct?.orderType ?? OrderType.atTheBottom, {
      shouldValidate: true,
    });

    setValue('orderAfterId', sectionProduct?.orderAfterId ?? null, {
      shouldValidate: Boolean(sectionProduct),
    });
  }, [sectionProduct]);

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

  const onSubmit = (data: EditProductInputs) => {
    const preparedData = {
      id: product.id,
      name: data.name,
      units: data.units,
      type: product.type,
      sectionId: data.sectionId ?? undefined,
      orderType: data.orderType ?? undefined,
      orderAfterId: data.orderAfterId ?? undefined,
    };

    mutation.mutate(preparedData, {
      onSuccess: generateOnSuccess({
        alertTime: 5,
        message: 'successfullyEdited',
        reset,
        fn: () => {
          queryClient.invalidateQueries({ queryKey: ['products'] });
          queryClient.invalidateQueries({
            queryKey: ['shop', shopId, sectionId],
          });
          onClose();
        },
      }),
      onError: generateOnError({ setError }),
    });
  };

  const isShop = typeof shopId === 'number';
  const isSection = typeof sectionId === 'number';

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
      shops={shops.data}
      isOpen={shopModal.isOpen}
      defaultName={shopModal.data}
      onClose={handleCloseShop}
    />
  ) : null;

  const addSectionContent =
    sectionModal.isRender && isShop ? (
      <AddSectionModal
        shopId={shopId}
        sections={sections.data}
        isOpen={sectionModal.isOpen}
        defaultName={sectionModal.data}
        onClose={handleCloseSection}
      />
    ) : null;

  return (
    <>
      <FormModal
        titleKey="editProduct"
        isOpen={isOpen}
        isLoading={mutation.isLoading}
        reset={reset}
        onClose={onClose}
        handleSubmit={handleSubmit(onSubmit)}
      >
        <Stack spacing={2} direction="column">
          <Input
            name="name"
            labelKey="name"
            control={control}
            disabled={product.type === ProductType.global}
          />
          <ToggleButtonGroup
            fullWidth
            name="units"
            multiple={true}
            titleKey="units"
            control={control}
            translationKey="unit"
            disabled={product.type === ProductType.global}
            options={[Unit.grams, Unit.milliliters, Unit.packs, Unit.pieces]}
          />
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

const useQueries = (shopId: number | null, sectionId: number | null) => {
  const isShop = typeof shopId === 'number';
  const isSection = typeof sectionId === 'number';

  const shopsQuery = useQuery({
    queryKey: ['shops'],
    queryFn: getShops,
    onError: generateOnError(),
  });

  const sectionsQuery = useQuery({
    queryKey: ['shop', shopId],
    queryFn: () => (isShop ? getSections({ shopId }) : undefined),
    onError: generateOnError(),
    enabled: isShop,
  });

  const sectionProductsQuery = useQuery({
    queryKey: ['shop', shopId, sectionId],
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
