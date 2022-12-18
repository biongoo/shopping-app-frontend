import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Box, CircularProgress, Stack } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { getShops, reorderShops } from '~/api';
import { Breadcrumbs, IconButton, Table, TranslatedText } from '~/bits';
import { QueryKey } from '~/enums';
import { ModifyData, Shop } from '~/types';
import {
  changeOrder,
  generateOnError,
  generateOnSuccess,
  hasOrderChanged,
  Id,
  useModal,
} from '~/utils';
import { AddShop, ModifyShop } from './components';

const breadcrumbs = [{ key: 'home' }, { key: 'shops' }];

const getColumns = (
  setOpenOptions: (data?: ModifyData | undefined) => void,
  optionsId?: number
) =>
  Table.createColumns<Shop>(() => [
    {
      dataKey: 'order',
      labelKey: '#',
      isOrdering: true,
      width: 0,
      render: (x) => <>{x.order}</>,
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
    queryKey: [QueryKey.shops],
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

  const shops = data?.data ?? [];

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
        order: x.order,
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
        shops={shops}
        data={options.data}
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
        <AddShop isReordering={isReordering} />
      </Stack>
      <Table
        name="shops"
        defaultOrderBy="order"
        emptyKey="addYourShops"
        isReordering={isReordering}
        data={reorderedShops ?? shops}
        isShowingActions={options.isOpen}
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
