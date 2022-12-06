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
  orderAfterId: number | null;
};

export const EditShopModal = (props: EditShopModalProps) => {
  const { shop, shops, isOpen, onClose } = props;
  const queryClient = useQueryClient();
  const mutation = useMutation(editShop);
  const {
    control,
    reset,
    watch,
    setError,
    setValue,
    clearErrors,
    handleSubmit,
  } = useForm<EditShopInputs>();
  const orderType = watch('orderType') ?? shop.orderType;

  useEffect(() => {
    clearErrors('orderAfterId');
    setValue('orderAfterId', shop.orderAfterId ?? null);
  }, [orderType]);

  const onSubmit = (data: EditShopInputs) => {
    const preparedData = {
      shopId: shop.id,
      name: data.name,
      orderType: data.orderType,
      orderAfterId: data.orderAfterId ?? undefined,
    };

    mutation.mutate(preparedData, {
      onSuccess: generateOnSuccess({
        alertTime: 5,
        message: 'successfullyEdited',
        reset,
        fn: () => {
          queryClient.invalidateQueries({ queryKey: ['shops'] });
          queryClient.invalidateQueries({ queryKey: ['products'] });
          queryClient.invalidateQueries({ queryKey: ['sections'] });
          queryClient.invalidateQueries({ queryKey: ['section-products'] });
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
          defaultValue={shop.orderType ?? null}
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
