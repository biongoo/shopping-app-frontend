import { Stack } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { editSection } from '~/api';
import { Autocomplete, FormModal, Input, ToggleButtonGroup } from '~/bits';
import { OrderType } from '~/enums';
import { Section } from '~/types';
import { generateOnError, generateOnSuccess } from '~/utils';

type EditSectionModalProps = {
  section: Section;
  sections: Section[];
  isOpen: boolean;
  onClose: () => void;
};

type EditSectionInputs = {
  name: string;
  orderType: OrderType;
  orderAfterId?: number;
};

export const EditSectionModal = (props: EditSectionModalProps) => {
  const { section, sections, isOpen, onClose } = props;
  const queryClient = useQueryClient();
  const mutation = useMutation(editSection);
  const { control, handleSubmit, reset, setError, setValue, watch } =
    useForm<EditSectionInputs>();
  const orderType = watch('orderType') ?? section.orderType;

  useEffect(() => {
    setValue('orderAfterId', section.orderAfterId);
  }, [orderType]);

  const onSubmit = (data: EditSectionInputs) => {
    const preparedData = { ...data, id: section.id, shopId: section.shopId };

    mutation.mutate(preparedData, {
      onSuccess: generateOnSuccess({
        alertTime: 5,
        message: 'successfullyEdited',
        reset,
        fn: () => {
          queryClient.invalidateQueries({ queryKey: ['shop', section.shopId] });
          onClose();
        },
      }),
      onError: generateOnError({ setError }),
    });
  };

  const additionalInput =
    orderType === OrderType.afterItem ? (
      <Autocomplete
        titleKey="section"
        control={control}
        name="orderAfterId"
        defaultValue={section.orderAfterId}
        required={orderType === OrderType.afterItem}
        options={sections
          .filter((x) => x.id != section.id)
          .map((x) => ({
            value: x.id,
            label: x.name,
          }))}
      />
    ) : null;

  return (
    <FormModal
      titleKey="editSection"
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
          defaultValue={section.name}
        />
        <ToggleButtonGroup
          fullWidth
          name="orderType"
          control={control}
          titleKey="position"
          translationKey="orderType"
          defaultValue={section.orderType}
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
