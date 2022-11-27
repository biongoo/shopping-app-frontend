import { Stack } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { addSection } from '~/api';
import { Autocomplete, FormModal, Input, ToggleButtonGroup } from '~/bits';
import { OrderType } from '~/enums';
import { Section } from '~/types';
import { generateOnError, generateOnSuccess } from '~/utils';

type Props = {
  shopId: number;
  isOpen: boolean;
  sections: Section[];
  onClose: () => void;
};

type AddSectionInputs = {
  name: string;
  orderType: OrderType;
  orderAfterId?: number;
};

export const AddSectionModal = (props: Props) => {
  const { sections, isOpen, shopId, onClose } = props;
  const queryClient = useQueryClient();
  const mutation = useMutation(addSection);
  const { control, handleSubmit, reset, setError, setValue, watch } =
    useForm<AddSectionInputs>();

  const orderType = watch('orderType');

  useEffect(() => {
    setValue('orderAfterId', undefined);
  }, [orderType]);

  const onSubmit = (data: AddSectionInputs) => {
    const preparedData = {
      shopId,
      ...data,
    };

    mutation.mutate(preparedData, {
      onSuccess: generateOnSuccess({
        alertTime: 5,
        message: 'successfullyAdded',
        reset,
        fn: () => {
          queryClient.invalidateQueries({ queryKey: ['shop', shopId] });
          onClose();
        },
      }),
      onError: generateOnError({ setError }),
    });
  };

  const additionalInput =
    orderType === OrderType.afterItem ? (
      <Autocomplete
        control={control}
        titleKey="section"
        name="orderAfterId"
        required={orderType === OrderType.afterItem}
        options={sections.map((x) => ({
          value: x.id,
          label: x.name,
        }))}
      />
    ) : null;

  return (
    <FormModal
      titleKey="addSection"
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
