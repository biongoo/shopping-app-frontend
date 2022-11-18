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
  onClose: () => void;
};

type AddShopInputs = {
  name: string;
  orderType: OrderType;
  orderAfterId?: number;
};

export const AddShopModal = (props: Props) => {
  const { shops, isOpen, onClose } = props;
  const queryClient = useQueryClient();
  const mutation = useMutation(addShop);
  const { control, handleSubmit, reset, setError, setValue, watch } =
    useForm<AddShopInputs>();

  const orderType = watch('orderType');

  useEffect(() => {
    setValue('orderAfterId', undefined);
  }, [orderType]);

  const onSubmit = (data: AddShopInputs) => {
    mutation.mutate(data, {
      onSuccess: generateOnSuccess({
        alertTime: 5,
        message: 'successfullyAdded',
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
        required={orderType === OrderType.afterItem}
        options={shops.map((x) => ({
          value: x.id,
          label: x.name,
          shouldBeTranslated: false,
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
        <Input name="name" labelKey="name" control={control} defaultValue="" />
        <ToggleButtonGroup
          fullWidth
          name="orderType"
          titleKey="position"
          control={control}
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
