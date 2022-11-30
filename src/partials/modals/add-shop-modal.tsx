import { Stack } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { addShop } from '~/api';
import { Autocomplete, FormModal, Input, ToggleButtonGroup } from '~/bits';
import { OrderType } from '~/enums';
import { Shop } from '~/types';
import { generateOnError, generateOnSuccess } from '~/utils';

type Props = {
  shops: Shop[];
  isOpen: boolean;
  onClose: (shopId?: number) => void;
  defaultName?: string;
};

type AddShopInputs = {
  name: string;
  orderType: OrderType;
  orderAfterId: number | null;
};

export const AddShopModal = (props: Props) => {
  const { shops, isOpen, onClose, defaultName } = props;
  const queryClient = useQueryClient();
  const mutation = useMutation(addShop);
  const {
    control,
    reset,
    watch,
    setError,
    setValue,
    clearErrors,
    handleSubmit,
  } = useForm<AddShopInputs>();

  const orderType = watch('orderType');

  useEffect(() => {
    clearErrors('orderAfterId');
    setValue('orderAfterId', null);
  }, [orderType]);

  const onSubmit = (data: AddShopInputs) => {
    const preparedData = {
      name: data.name,
      orderType: data.orderType,
      orderAfterId: data.orderAfterId ?? undefined,
    };

    mutation.mutate(preparedData, {
      onSuccess: generateOnSuccess({
        alertTime: 5,
        message: 'successfullyAdded',
        reset,
        fn: ({ data }) => {
          queryClient.invalidateQueries({ queryKey: ['shops'] });
          onClose(data.id);
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
        required={orderType === OrderType.afterItem}
        options={shops.map((x) => ({
          value: x.id,
          label: x.name,
        }))}
      />
    ) : null;

  return (
    <FormModal
      titleKey="addShop"
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
          defaultValue={defaultName ?? ''}
        />
        <ToggleButtonGroup
          fullWidth
          name="orderType"
          control={control}
          titleKey="position"
          translationKey="orderType"
          defaultValue={OrderType.atTheBottom}
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
