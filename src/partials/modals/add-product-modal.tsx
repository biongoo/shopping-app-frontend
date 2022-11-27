import { Stack } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { addProduct, getSections, getShops } from '~/api';
import { Autocomplete, FormModal, Input, ToggleButtonGroup } from '~/bits';
import { Unit } from '~/enums';
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
  shopId?: number;
  sectionId?: number;
};

export const AddProductModal = (props: Props) => {
  const { isOpen, onClose, onHide, onOpen } = props;
  const queryClient = useQueryClient();
  const mutation = useMutation(addProduct);
  const [shopModal, setOpenShop, setCloseShop] = useModal<string>();
  const [sectionModal, setOpenSection, setCloseSection] = useModal<string>();
  const { control, handleSubmit, reset, setError, watch, setValue } =
    useForm<AddProductInputs>();

  const shopId = watch('shopId');
  const isShop = shopId !== undefined;

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

  const handleOpenShop = (name: string) => {
    onHide();
    setTimeout(() => setOpenShop(name), 200);
  };

  const handleCloseShop = (shopId?: number) => {
    setCloseShop();
    setValue('shopId', shopId);
    setTimeout(onOpen, 200);
  };

  const handleOpenSection = (name: string) => {
    onHide();
    setTimeout(() => setOpenSection(name), 200);
  };

  const handleCloseSection = (sectionId?: number) => {
    setCloseSection();
    setValue('sectionId', sectionId);
    setTimeout(onOpen, 200);
  };

  const shops = shopsQuery.data?.data ?? [];
  const sections = sectionsQuery.data?.data ?? [];

  const onSubmit = (data: AddProductInputs) => {
    mutation.mutate(data, {
      onSuccess: generateOnSuccess({
        alertTime: 5,
        message: 'successfullyAdded',
        reset,
        fn: () => {
          if (isShop) {
            queryClient.invalidateQueries({ queryKey: ['shop', shopId] });
          }
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
      isInitialFetching={sectionsQuery.isInitialLoading}
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
    sectionModal.isRender && shopId !== undefined ? (
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
            dynamicAdd={{
              defaultValue: -1,
              emptyAddKey: 'addShop',
              onAddNewItem: handleOpenShop,
            }}
            isInitialFetching={shopsQuery.isInitialLoading}
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
