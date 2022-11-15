import { Stack } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { editShop } from '~/api';
import { FormModal, Input } from '~/bits';
import { Shop } from '~/types';
import { generateOnError, generateOnSuccess } from '~/utils';

type EditShopModalProps = {
  shop?: Shop;
  isOpen: boolean;
  onClose: () => void;
};

type EditShopInputs = {
  name: string;
};

export const EditShopModal = (props: EditShopModalProps) => {
  const { shop, isOpen, onClose } = props;

  const queryClient = useQueryClient();
  const { control, handleSubmit, reset, setError, setValue } =
    useForm<EditShopInputs>();

  useEffect(() => {
    setValue('name', shop?.name ?? '');
  }, [shop?.name]);

  const mutation = useMutation({
    mutationFn: editShop,
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

  const onSubmit = (data: EditShopInputs) => {
    if (!shop?.id || shop.name === data.name) {
      onClose();
      return;
    }

    mutation.mutate({ ...data, shopId: shop.id });
  };

  return (
    <FormModal
      titleKey="editShop"
      isOpen={isOpen}
      isLoading={mutation.isLoading}
      reset={reset}
      onClose={onClose}
      handleSubmit={handleSubmit(onSubmit)}
    >
      <Stack>
        <Input name="name" labelKey="name" control={control} defaultValue="" />
      </Stack>
    </FormModal>
  );
};
