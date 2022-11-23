import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Box, CircularProgress, Stack } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { getShops, reorderShops } from '~/api';
import { Breadcrumbs, IconButton, Table, TranslatedText } from '~/bits';
import { Shop } from '~/types';
import {
  changeOrder,
  generateOnError,
  generateOnSuccess,
  hasOrderChanged,
  useModal,
} from '~/utils';
import { AddShop, ModifyData, ModifyShop } from './components';

type Id = string | number;

const breadcrumbs = [{ key: 'home' }, { key: 'shops' }];

const getColumns = (
  setOpenOptions: (data?: ModifyData | undefined) => void,
  optionsId?: number
) =>
  Table.createColumns<Shop>(() => [
    {
      dataKey: 'orderNumber',
      labelKey: '#',
      isOrdering: true,
      width: 0,
      render: (x) => <>{x.orderNumber}</>,
    },
    {
      dataKey: 'name',
      labelKey: 'name',
      isOrdering: true,
      width: 100,
      render: (x) => <>{x.name}</>,
    },
    {
      dataKey: 'actions',
      labelKey: 'none',
      isOrdering: false,
      width: 0,
      py: 0,
      render: (x, _i, isReordering) => (
        <IconButton
          scale={0.9}
          placement="left"
          titleKey="options"
          disabled={isReordering}
          open={optionsId === x.id}
          onClick={(e) =>
            setOpenOptions({
              id: x.id,
              element: e.currentTarget,
            })
          }
        >
          <MoreVertIcon />
        </IconButton>
      ),
    },
  ]);

export const ShopPage = () => {
  const mutation = useMutation(reorderShops);
  const [reorderedShops, setReorderedShops] = useState<Shop[]>();
  const isReordering = Boolean(reorderedShops);
  const [options, setOpenOptions, setCloseOptions, setHideOptions] =
    useModal<ModifyData>();

  const { data, isInitialLoading, refetch } = useQuery({
    queryKey: ['shops'],
    queryFn: getShops,
    enabled: !isReordering,
    onError: generateOnError(),
  });

  if (isInitialLoading) {
    return (
      <Box textAlign="center">
        <CircularProgress />
      </Box>
    );
  }

  const shops = data?.data;

  const handleStartReorder = () => {
    setReorderedShops(shops);
  };

  const handleDrag = (firstId: Id, secondId: Id) => {
    setReorderedShops(changeOrder(firstId, secondId));
  };

  const handleEndReorder = async () => {
    if (!reorderedShops || mutation.isLoading) {
      return;
    }

    if (!hasOrderChanged(reorderedShops, shops)) {
      setReorderedShops(undefined);
      return;
    }

    const data = {
      shops: reorderedShops.map((x) => ({
        id: x.id,
        orderNumber: x.orderNumber,
      })),
    };

    const res = await mutation.mutateAsync(data, {
      onSuccess: generateOnSuccess({
        message: 'successfullyReordered',
      }),
      onError: generateOnError(),
    });

    if (res.status === 'ok') {
      await refetch();
    }

    setReorderedShops(undefined);
  };

  const optionsContent =
    options.isRender && options.data ? (
      <ModifyShop
        data={options.data}
        shops={shops ?? []}
        isOpen={options.isOpen}
        onHide={setHideOptions}
        onClose={setCloseOptions}
      />
    ) : null;

  const optionsId = options.isOpen ? options.data?.id : undefined;

  return (
    <Stack sx={{ flexGrow: 1, overflow: 'auto' }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={4}
      >
        <Box>
          <TranslatedText variant="h5" gutterBottom textKey="shops" />
          <Breadcrumbs elements={breadcrumbs} />
        </Box>
        <AddShop isReordering={isReordering} shops={shops ?? []} />
      </Stack>
      <Table
        name="shops"
        emptyKey="addYourShops"
        isReordering={isReordering}
        defaultOrderBy="orderNumber"
        isShowingActions={options.isOpen}
        data={reorderedShops ?? shops ?? []}
        isFetchingReorder={mutation.isLoading}
        columns={getColumns(setOpenOptions, optionsId)}
        onDrag={handleDrag}
        onEndReorder={handleEndReorder}
        onStartReorder={handleStartReorder}
      />
      {optionsContent}
    </Stack>
  );
};
