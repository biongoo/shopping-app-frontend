import { arrayMove } from '@dnd-kit/sortable';
import { Box, CircularProgress, Stack } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { getShops, reorderShops } from '~/api';
import { Breadcrumbs, TranslatedText } from '~/bits';
import { Table } from '~/bits/table';
import { Shop } from '~/types';
import { generateOnError, generateOnSuccess } from '~/utils';
import { AddShopModal } from './components';

type Id = string | number;

const breadcrumbs = [{ key: 'home' }, { key: 'shops' }];
const headers = [
  { labelKey: 'orderNumber', isOrdering: true },
  { labelKey: 'name', isOrdering: true },
];

const hasOrderChanged = (reorderedShops: Shop[], originalShops?: Shop[]) => {
  for (const shop of reorderedShops) {
    const originalOrder = originalShops?.find(
      (x) => x.id === shop.id
    )?.orderNumber;

    if (originalOrder != shop.orderNumber) {
      return true;
    }
  }

  return false;
};

export const ShopPage = () => {
  const [reorderedShops, setReorderedShops] = useState<Shop[] | null>();
  const isReordering = Boolean(reorderedShops);

  const { data, isInitialLoading, refetch } = useQuery({
    queryKey: ['shops'],
    queryFn: getShops,
    enabled: !isReordering,
  });

  const mutation = useMutation({
    mutationFn: reorderShops,
    onSuccess: generateOnSuccess({
      message: 'successfullyReordered',
    }),
    onError: generateOnError(),
  });

  if (isInitialLoading) {
    return (
      <Box textAlign="center">
        <CircularProgress />
      </Box>
    );
  }

  const handleStartReorder = () => {
    setReorderedShops(data?.data);
  };

  const handleDrag = (firstId: Id, secondId: Id) => {
    setReorderedShops((shops) => {
      if (!shops) {
        return;
      }

      const activeIndex = shops.findIndex((x) => x.id === firstId);
      const overIndex = shops.findIndex((x) => x.id === secondId);

      return arrayMove(shops, activeIndex, overIndex).map((x, i) => ({
        ...x,
        orderNumber: i + 1,
      }));
    });
  };

  const handleEndReorder = async () => {
    if (!reorderedShops || mutation.isLoading) {
      return;
    }

    if (!hasOrderChanged(reorderedShops, data?.data)) {
      setReorderedShops(null);
      return;
    }

    const preparedData = reorderedShops.map((x) => ({
      id: x.id,
      orderNumber: x.orderNumber,
    }));

    const res = await mutation.mutateAsync({ shops: preparedData });

    if (res.status === 'ok') {
      await refetch();
    }

    setReorderedShops(null);
  };

  return (
    <Stack sx={{ height: '100%' }}>
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
        <AddShopModal isReordering={isReordering} />
      </Stack>
      <Table
        id="users"
        headers={headers}
        isReordering={isReordering}
        isFetchingReorder={mutation.isLoading}
        data={reorderedShops ?? data?.data ?? []}
        onDrag={handleDrag}
        onStartReorder={handleStartReorder}
        onEndReorder={handleEndReorder}
      />
    </Stack>
  );
};
