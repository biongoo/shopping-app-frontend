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
const headers = [
  { labelKey: 'orderNumber', isOrdering: true },
  { labelKey: 'name', isOrdering: true },
];

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

  const actions = (id: number) => (
    <IconButton
      scale={0.9}
      placement="left"
      titleKey="options"
      disabled={isReordering}
      open={options.data?.id === id}
      onClick={(e) => setOpenOptions({ element: e.currentTarget, id })}
    >
      <MoreVertIcon />
    </IconButton>
  );

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
          <AddShop isReordering={isReordering} shops={shops ?? []} />
        </Stack>
        <Table
          id="users"
          headers={headers}
          isReordering={isReordering}
          data={reorderedShops ?? shops ?? []}
          isFetchingReorder={mutation.isLoading}
          elementShowingActions={options.data?.id}
          onDrag={handleDrag}
          renderActions={actions}
          onStartReorder={handleStartReorder}
          onEndReorder={handleEndReorder}
        />
      </Stack>
      {optionsContent}
    </>
  );
};
