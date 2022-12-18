import { Stack } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm, UseFormReset, UseFormSetError } from 'react-hook-form';
import { addSection, editSection, getSections, PostSectionDto } from '~/api';
import { Autocomplete, FormModal, Input, ToggleButtonGroup } from '~/bits';
import { OrderType, QueryKey } from '~/enums';
import { ApiData } from '~/models';
import { Section } from '~/types';
import { generateOnError, generateOnSuccess } from '~/utils';

type Props = {
  shopId: number;
  isOpen: boolean;
  section?: Section;
  defaultName?: string;
  onClose: (sectionId?: number) => void;
};

type SectionInputs = {
  name: string;
  orderType: OrderType;
  orderAfterId: number | null;
};

type OnSubmitProps = {
  data: PostSectionDto;
  fn: (data: ApiData<Section>, variables: PostSectionDto) => void;
  reset: UseFormReset<SectionInputs>;
  setError: UseFormSetError<SectionInputs>;
};

type SectionModalProps = Props & {
  isLoading: boolean;
  onSubmitForm: (props: OnSubmitProps) => void;
};

export const AddSectionModal = (props: Props) => {
  const mutation = useMutation(addSection);

  const handleSubmit = (onSubmitProps: OnSubmitProps) => {
    mutation.mutate(onSubmitProps.data, {
      onSuccess: generateOnSuccess({
        alertTime: 5,
        message: 'successfullyAdded',
        reset: onSubmitProps.reset,
        fn: onSubmitProps.fn,
      }),
      onError: generateOnError({ setError: onSubmitProps.setError }),
    });
  };

  return (
    <SectionModal
      {...props}
      onSubmitForm={handleSubmit}
      isLoading={mutation.isLoading}
    />
  );
};

export const EditSectionModal = (props: Props) => {
  const { section, onClose } = props;
  const mutation = useMutation(editSection);

  if (section === undefined) {
    onClose();
    return null;
  }

  const handleSubmit = (onSubmitProps: OnSubmitProps) => {
    const preparedData = {
      ...onSubmitProps.data,
      id: section.id,
    };

    mutation.mutate(preparedData, {
      onSuccess: generateOnSuccess({
        alertTime: 5,
        message: 'successfullyEdited',
        reset: onSubmitProps.reset,
        fn: onSubmitProps.fn,
      }),
      onError: generateOnError({ setError: onSubmitProps.setError }),
    });
  };

  return (
    <SectionModal
      {...props}
      onSubmitForm={handleSubmit}
      isLoading={mutation.isLoading}
    />
  );
};

const SectionModal = (props: SectionModalProps) => {
  const {
    isOpen,
    shopId,
    section,
    isLoading,
    defaultName,
    onClose,
    onSubmitForm,
  } = props;
  const queryClient = useQueryClient();
  const { control, reset, watch, setError, setValue, getValues, handleSubmit } =
    useForm<SectionInputs>({
      defaultValues: {
        name: section?.name ?? defaultName ?? '',
        orderType: section?.orderType ?? OrderType.atTheBottom,
        orderAfterId: section?.orderAfterId ?? null,
      },
    });

  const orderType = watch('orderType');
  const { sections } = useQueries(shopId);

  useEffect(() => {
    if (getValues('orderAfterId') === (section?.orderAfterId ?? null)) {
      return;
    }

    setValue('orderAfterId', section?.orderAfterId ?? null, {
      shouldValidate: Boolean(section?.orderAfterId),
    });
  }, [orderType]);

  const onSubmit = (data: SectionInputs) => {
    const preparedData = {
      shopId,
      name: data.name,
      orderType: data.orderType,
      orderAfterId: data.orderAfterId ?? undefined,
    };

    onSubmitForm({
      data: preparedData,
      reset,
      setError,
      fn: ({ data }) => {
        queryClient.invalidateQueries({ queryKey: [QueryKey.products] });
        queryClient.invalidateQueries({ queryKey: [QueryKey.sections] });
        queryClient.invalidateQueries({ queryKey: [QueryKey.sectionProducts] });
        queryClient.invalidateQueries({ queryKey: [QueryKey.lists] });
        onClose(data.id);
      },
    });
  };

  const orderAfterIdInput =
    orderType === OrderType.afterItem ? (
      <Autocomplete
        required={true}
        control={control}
        titleKey="section"
        name="orderAfterId"
        isInitialFetching={sections.isInitialLoading}
        options={sections.data
          .filter((x) => x.id !== section?.id)
          .map((x) => ({
            value: x.id,
            label: x.name,
          }))}
      />
    ) : null;

  return (
    <FormModal
      isOpen={isOpen}
      isLoading={isLoading}
      titleKey={section ? 'editSection' : 'addSection'}
      reset={reset}
      onClose={onClose}
      handleSubmit={handleSubmit(onSubmit)}
    >
      <Stack spacing={2} direction="column">
        <Input name="name" labelKey="name" control={control} />
        <ToggleButtonGroup
          fullWidth
          name="orderType"
          control={control}
          titleKey="position"
          translationKey="orderType"
          options={[
            OrderType.atTheTop,
            OrderType.atTheBottom,
            OrderType.afterItem,
          ]}
        />
        {orderAfterIdInput}
      </Stack>
    </FormModal>
  );
};

const useQueries = (shopId: number) => {
  const sectionsQuery = useQuery({
    queryKey: [QueryKey.sections, shopId],
    queryFn: () => getSections({ shopId }),
    onError: generateOnError(),
  });

  const sections = sectionsQuery.data?.data ?? [];

  return {
    sections: {
      data: sections,
      isInitialLoading: sectionsQuery.isInitialLoading,
    },
  };
};
