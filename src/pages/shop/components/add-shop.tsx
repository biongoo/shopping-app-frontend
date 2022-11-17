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
  ToggleButtonGroup,
  Autocomplete,
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
  afterShop: {
    value: number;
    label: string;
    shouldBeTranslated: boolean;
  };
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

  const additionalInput =
    orderType === OrderType.afterItem ? (
      <Autocomplete
        name="afterShop"
        control={control}
        titleKey="shop"
        options={props.shops.map((x) => ({
          value: x.id,
          label: x.name,
          shouldBeTranslated: false,
        }))}
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
          />
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
    </>
  );
};
