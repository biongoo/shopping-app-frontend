import AddIcon from '@mui/icons-material/Add';
import { Stack } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { addShop } from '~/api';
import { FormModal, IconButton, Input } from '~/bits';
import { generateOnError, generateOnSuccess } from '~/utils';

type Props = {
  isReordering: boolean;
};

type AddShopInputs = {
  name: string;
};

export const AddShop = (props: Props) => {
  const queryClient = useQueryClient();
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const { control, handleSubmit, reset, setError } = useForm<AddShopInputs>();

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
        <Stack>
          <Input
            name="name"
            labelKey="name"
            control={control}
            defaultValue=""
          />
        </Stack>
      </FormModal>
    </>
  );
};
