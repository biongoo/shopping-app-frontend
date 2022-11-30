import { Stack } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { editProduct, getSections, getShops } from '~/api';
import { Autocomplete, FormModal, Input, ToggleButtonGroup } from '~/bits';
import { ProductType, Unit } from '~/enums';
import { AddSectionModal, AddShopModal } from '~/partials';
import { Product } from '~/types';
import { generateOnError, generateOnSuccess, useModal } from '~/utils';

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
};

export const EditProductModal = (props: Props) => {
  const { isOpen, product, onClose, onHide, onOpen } = props;
  const queryClient = useQueryClient();
  const mutation = useMutation(editProduct);
  const [shopIdToUpdate, setShopIdToUpdate] = useState<number>();
  const [shopModal, setOpenShop, setCloseShop] = useModal<string>();
  const [sectionIdToUpdate, setSectionIdToUpdate] = useState<number>();
  const [sectionModal, setOpenSection, setCloseSection] = useModal<string>();
  const { control, handleSubmit, reset, setError, watch, setValue } =
    useForm<EditProductInputs>();

  const shopId = watch('shopId');
  const isShop = typeof shopId === 'number';

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

  const shops = shopsQuery.data?.data ?? [];
  const sections = sectionsQuery.data?.data ?? [];

  useEffect(() => {
    setValue('shopId', product.shopId ?? null);
    setValue('sectionId', product.sectionId ?? null);
  }, []);

  useEffect(() => {
    if (
      shopIdToUpdate !== undefined &&
      shops.some((x) => x.id === shopIdToUpdate)
    ) {
      setValue('shopId', shopIdToUpdate, { shouldValidate: true });
      setShopIdToUpdate(undefined);
    }
  }, [shops, shopIdToUpdate]);

  useEffect(() => {
    if (
      sectionIdToUpdate !== undefined &&
      sections.some((x) => x.id === sectionIdToUpdate)
    ) {
      setValue('sectionId', sectionIdToUpdate, { shouldValidate: true });
      setSectionIdToUpdate(undefined);
    }
  }, [sections, sectionIdToUpdate]);

  const handleChangeShopId = () => {
    setValue('sectionId', null);
  };

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

  const onSubmit = (data: EditProductInputs) => {
    const preparedData = {
      id: product.id,
      name: data.name,
      units: data.units,
      type: product.type,
      sectionId: data.sectionId ?? undefined,
    };

    mutation.mutate(preparedData, {
      onSuccess: generateOnSuccess({
        alertTime: 5,
        message: 'successfullyEdited',
        reset,
        fn: () => {
          queryClient.invalidateQueries({ queryKey: ['products'] });
          onClose();
        },
      }),
      onError: generateOnError({ setError }),
    });
  };

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
        sectionsQuery.isInitialLoading || sectionIdToUpdate !== undefined
      }
      options={sections.map((x) => ({
        value: x.id,
        label: x.name,
      }))}
    />
  ) : null;

  const addShopContent = shopModal.isRender ? (
    <AddShopModal
      shops={shops}
      isOpen={shopModal.isOpen}
      defaultName={shopModal.data}
      onClose={handleCloseShop}
    />
  ) : null;

  const addSectionContent =
    sectionModal.isRender && isShop ? (
      <AddSectionModal
        shopId={shopId}
        sections={sections}
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
            defaultValue={product.name}
            disabled={product.type === ProductType.global}
          />
          <ToggleButtonGroup
            fullWidth
            name="units"
            multiple={true}
            titleKey="units"
            control={control}
            translationKey="unit"
            defaultValue={product.units}
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
              shopsQuery.isInitialLoading || shopIdToUpdate !== undefined
            }
            options={shops.map((x) => ({
              value: x.id,
              label: x.name,
            }))}
          />
          {sectionsInput}
        </Stack>
      </FormModal>
      {addShopContent}
      {addSectionContent}
    </>
  );
};
