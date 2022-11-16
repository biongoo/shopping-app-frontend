import AddIcon from '@mui/icons-material/Add';
import { Stack } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { addShop } from '~/api';
import {
  FormModal,
  IconButton,
  Input,
  Select,
  ToggleButtonGroup,
} from '~/bits';
import { OrderType } from '~/enums';
import { Shop } from '~/types';
import { generateOnError, generateOnSuccess } from '~/utils';

type Props = {
  shops: Shop[];
  isReordering: boolean;
};

type AddShopInputs = {
  name: string;
  orderType: OrderType;
  afterShopId: number;
};

export const AddShop = (props: Props) => {
  const queryClient = useQueryClient();
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const { control, handleSubmit, reset, setError, watch } =
    useForm<AddShopInputs>();

  const mutation = useMutation({
    mutationFn: addShop,
    onSuccess: generateOnSuccess({
      alertTime: 5,
      message: 'successfullyAdded',
      reset,
      fn: () => {
        queryClient.invalidateQueries({ queryKey: ['shops'] });
        setIsOpenAddModal(false);
      },
    }),
    onError: generateOnError({ setError }),
  });

  const orderType = watch('orderType');

  const xd = [
    ...props.shops,
    ...props.shops,
    ...props.shops,
    ...props.shops,
    ...props.shops,
    ...props.shops,
    ...props.shops,
  ];

  const additionalInput =
    orderType === OrderType.afterItem ? (
      <Select
        name="afterShopId"
        labelKey="shop"
        control={control}
        defaultValue=""
        options={xd.map((x) => ({ value: x.id, itemName: x.name }))}
      />
    ) : null;

  return (
    <>
      <IconButton
        open={isOpenAddModal}
        disabled={props.isReordering}
        titleKey="addShop"
        onClick={() => setIsOpenAddModal(true)}
      >
        <AddIcon />
      </IconButton>
      <FormModal
        titleKey="addShop"
        isOpen={isOpenAddModal}
        isLoading={mutation.isLoading}
        reset={reset}
        onClose={() => setIsOpenAddModal(false)}
        handleSubmit={handleSubmit((data) => mutation.mutate(data))}
      >
        <Stack spacing={2} direction="column">
          <Input
            name="name"
            labelKey="name"
            control={control}
            defaultValue=""
            fullWidth
          />
          <ToggleButtonGroup
            name="orderType"
            titleKey="position"
            control={control}
            defaultValue={OrderType.atTheEnd}
            options={[
              OrderType.atTheTop,
              OrderType.atTheEnd,
              OrderType.afterItem,
            ]}
          />
          {additionalInput}
        </Stack>
      </FormModal>
    </>
  );
};
