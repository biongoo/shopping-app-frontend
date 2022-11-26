import { Stack } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { editShop } from '~/api';
import { Autocomplete, FormModal, Input, ToggleButtonGroup } from '~/bits';
import { OrderType } from '~/enums';
import { Shop } from '~/types';
import { generateOnError, generateOnSuccess } from '~/utils';

type EditShopModalProps = {
  shop: Shop;
  shops: Shop[];
  isOpen: boolean;
  onClose: () => void;
};

type EditShopInputs = {
  name: string;
  orderType: OrderType;
  orderAfterId?: number;
};

export const EditShopModal = (props: EditShopModalProps) => {
  const { shop, shops, isOpen, onClose } = props;
  const queryClient = useQueryClient();
  const mutation = useMutation(editShop);
  const { control, handleSubmit, reset, setError, setValue, watch } =
    useForm<EditShopInputs>();
  const orderType = watch('orderType') ?? shop.orderType;

  useEffect(() => {
    setValue('orderAfterId', shop.orderAfterId);
  }, [orderType]);

  const onSubmit = (data: EditShopInputs) => {
    const preparedData = { ...data, shopId: shop.id };

    mutation.mutate(preparedData, {
      onSuccess: generateOnSuccess({
        alertTime: 5,
        message: 'successfullyEdited',
        reset,
        fn: () => {
          queryClient.invalidateQueries({ queryKey: ['shops'] });
          onClose();
        },
      }),
      onError: generateOnError({ setError }),
    });
  };

  const additionalInput =
    orderType === OrderType.afterItem ? (
      <Autocomplete
        titleKey="shop"
        control={control}
        name="orderAfterId"
        defaultValue={shop.orderAfterId}
        required={orderType === OrderType.afterItem}
        options={shops
          .filter((x) => x.id != shop.id)
          .map((x) => ({
            value: x.id,
            label: x.name,
            shouldBeTranslated: false,
          }))}
      />
    ) : null;

  return (
    <FormModal
      titleKey="editShop"
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
          defaultValue={shop.name}
        />
        <ToggleButtonGroup
          fullWidth
          name="orderType"
          control={control}
          titleKey="position"
          translationKey="orderType"
          defaultValue={shop.orderType}
          options={[
            OrderType.atTheTop,
            OrderType.atTheBottom,
            OrderType.afterItem,
          ]}
        />
        {additionalInput}
      </Stack>
    </FormModal>
  );
};
