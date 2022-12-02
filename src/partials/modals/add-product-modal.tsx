import { Stack } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { addProduct, getSections, getShops } from '~/api';
import { Autocomplete, FormModal, Input, ToggleButtonGroup } from '~/bits';
import { OrderType, Unit } from '~/enums';
import { generateOnError, generateOnSuccess, useModal } from '~/utils';
import { AddSectionModal } from './add-section-modal';
import { AddShopModal } from './add-shop-modal';

type Props = {
  isOpen: boolean;
  onHide: () => void;
  onOpen: () => void;
  onClose: () => void;
};

type AddProductInputs = {
  name: string;
  units: Unit[];
  shopId: number | null;
  sectionId: number | null;
  orderType: OrderType | null;
  orderAfterId: number | null;
};

export const AddProductModal = (props: Props) => {
  const { isOpen, onClose, onHide, onOpen } = props;
  const queryClient = useQueryClient();
  const mutation = useMutation(addProduct);
  const [shopIdToUpdate, setShopIdToUpdate] = useState<number>();
  const [shopModal, setOpenShop, setCloseShop] = useModal<string>();
  const [sectionIdToUpdate, setSectionIdToUpdate] = useState<number>();
  const [sectionModal, setOpenSection, setCloseSection] = useModal<string>();
  const {
    control,
    reset,
    watch,
    setError,
    setValue,
    clearErrors,
    handleSubmit,
  } = useForm<AddProductInputs>();

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
    if (
      shopIdToUpdate !== undefined &&
      shops.some((x) => x.id === shopIdToUpdate)
    ) {
      setValue('shopId', shopIdToUpdate);
      setShopIdToUpdate(undefined);
    }
  }, [shops, shopIdToUpdate]);

  useEffect(() => {
    if (
      sectionIdToUpdate !== undefined &&
      sections.some((x) => x.id === sectionIdToUpdate)
    ) {
      setValue('sectionId', sectionIdToUpdate);
      setSectionIdToUpdate(undefined);
    }
  }, [sections, sectionIdToUpdate]);

  const handleChangeShopId = () => {
    clearErrors('sectionId');
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

  const onSubmit = (data: AddProductInputs) => {
    const preparedData = {
      name: data.name,
      units: data.units,
      sectionId: data.sectionId ?? undefined,
    };

    mutation.mutate(preparedData, {
      onSuccess: generateOnSuccess({
        alertTime: 5,
        message: 'successfullyAdded',
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
        titleKey="addProduct"
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
            defaultValue=""
          />
          <ToggleButtonGroup
            fullWidth
            name="units"
            multiple={true}
            titleKey="units"
            control={control}
            defaultValue={[]}
            translationKey="unit"
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
