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
} from '~/utils';
import { AddShop, ModifyData, ModifyShop } from './components';

type Id = string | number;

const breadcrumbs = [{ key: 'home' }, { key: 'shops' }];
const headers = [
  { labelKey: 'orderNumber', isOrdering: true },
  { labelKey: 'name', isOrdering: true },
];

export const ShopPage = () => {
  const [modifyData, setModifyData] = useState<ModifyData>(null);
  const [reorderedShops, setReorderedShops] = useState<Shop[] | null>();

  const isReordering = Boolean(reorderedShops);

  const { data, isInitialLoading, refetch } = useQuery({
    queryKey: ['shops'],
    queryFn: getShops,
    enabled: !isReordering,
  });

  const shops = data?.data;

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

  const handleOpenMenu = (currentTarget: HTMLElement, id: number) => {
    setModifyData({ element: currentTarget, id });
  };

  const handleCloseMenu = () => {
    setModifyData(null);
  };

  const actions = (id: number) => (
    <IconButton
      open={modifyData?.id === id}
      titleKey="options"
      scale={0.9}
      placement="left"
      disabled={isReordering}
      onClick={(e) => handleOpenMenu(e.currentTarget, id)}
    >
      <MoreVertIcon />
    </IconButton>
  );

  return (
    <>
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
          <AddShop isReordering={isReordering} />
        </Stack>
        <Table
          id="users"
          headers={headers}
          isReordering={isReordering}
          isFetchingReorder={mutation.isLoading}
          data={reorderedShops ?? shops ?? []}
          elementShowingActions={modifyData?.id}
          renderActions={actions}
          onDrag={handleDrag}
          onStartReorder={handleStartReorder}
          onEndReorder={handleEndReorder}
        />
      </Stack>
      <ModifyShop
        data={modifyData}
        shops={shops ?? []}
        onClose={handleCloseMenu}
      />
    </>
  );
};
