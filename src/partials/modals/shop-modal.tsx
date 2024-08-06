import { Stack } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm, UseFormReset, UseFormSetError } from 'react-hook-form';
import { addShop, editShop, getShops, PostShopDto } from '~/api';
import { Autocomplete, FormModal, Input, ToggleButtonGroup } from '~/bits';
import { OrderType, QueryKey } from '~/enums';
import { ApiData } from '~/models';
import { Shop } from '~/types';
import { generateOnError, generateOnSuccess, useClearCache } from '~/utils';

type Props = {
  isOpen: boolean;
  shop?: Shop;
  defaultName?: string;
  onClose: (shopId?: number) => void;
};

type ShopInputs = {
  name: string;
  orderType: OrderType;
  orderAfterId: number | null;
};

type OnSubmitProps = {
  data: PostShopDto;
  fn: (data: ApiData<Shop>, variables: PostShopDto) => void;
  reset: UseFormReset<ShopInputs>;
  setError: UseFormSetError<ShopInputs>;
};

type ShopModalProps = Props & {
  isLoading: boolean;
  onSubmitForm: (props: OnSubmitProps) => void;
};

export const AddShopModal = (props: Props) => {
  const mutation = useMutation({ mutationFn: addShop });

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
    <ShopModal
      {...props}
      onSubmitForm={handleSubmit}
      isLoading={mutation.isPending}
    />
  );
};

export const EditShopModal = (props: Props) => {
  const { shop, onClose } = props;
  const mutation = useMutation({ mutationFn: editShop });

  if (shop === undefined) {
    onClose();
    return null;
  }

  const handleSubmit = (onSubmitProps: OnSubmitProps) => {
    const preparedData = {
      ...onSubmitProps.data,
      shopId: shop.id,
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
    <ShopModal
      {...props}
      onSubmitForm={handleSubmit}
      isLoading={mutation.isPending}
    />
  );
};

const ShopModal = (props: ShopModalProps) => {
  const { shop, isOpen, defaultName, isLoading, onClose, onSubmitForm } = props;
  const clearCache = useClearCache(QueryKey.shops);
  const { control, reset, watch, setError, setValue, getValues, handleSubmit } =
    useForm<ShopInputs>({
      defaultValues: {
        name: shop?.name ?? defaultName ?? '',
        orderType: shop?.orderType ?? OrderType.atTheBottom,
        orderAfterId: shop?.orderAfterId ?? null,
      },
    });

  const orderType = watch('orderType');
  const { shops } = useQueries();

  const handleChangeOrderType = (value: number, prevValue: number) => {
    if (value === prevValue) {
      return;
    }

    if (getValues('orderAfterId') === (shop?.orderAfterId ?? null)) {
      return;
    }

    setValue('orderAfterId', shop?.orderAfterId ?? null, {
      shouldValidate: Boolean(shop?.orderAfterId),
    });
  };

  const onSubmit = (data: ShopInputs) => {
    const preparedData = {
      name: data.name,
      orderType: data.orderType,
      orderAfterId: data.orderAfterId ?? undefined,
    };

    onSubmitForm({
      data: preparedData,
      reset,
      setError,
      fn: ({ data }) => {
        clearCache();
        onClose(data.id);
      },
    });
  };

  const orderAfterIdInput =
    orderType === OrderType.afterItem ? (
      <Autocomplete
        required={true}
        titleKey="shop"
        control={control}
        name="orderAfterId"
        isInitialFetching={shops.isInitialLoading}
        options={shops.data
          .filter((x) => x.id !== shop?.id)
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
      titleKey={shop ? 'editShop' : 'addShop'}
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
          onChange={handleChangeOrderType}
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

const useQueries = () => {
  const shopsQuery = useQuery({
    queryKey: [QueryKey.shops],
    queryFn: getShops,
  });

  const shops = shopsQuery.data?.data ?? [];

  return {
    shops: {
      data: shops,
      isInitialLoading: shopsQuery.isLoading,
    },
  };
};
