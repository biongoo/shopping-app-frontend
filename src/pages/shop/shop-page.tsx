import { arrayMove } from '@dnd-kit/sortable';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
  Box,
  CircularProgress,
  ListItemIcon,
  MenuItem,
  Popover,
  Stack,
} from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getShops, reorderShops } from '~/api';
import { Breadcrumbs, IconButton, Table, TranslatedText } from '~/bits';
import { Shop } from '~/types';
import { generateOnError, generateOnSuccess } from '~/utils';
import { AddShopModal } from './components';

type Id = string | number;

type DetailsPopover = {
  id: number;
  element: HTMLElement;
} | null;

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
  const navigate = useNavigate();
  const [reorderedShops, setReorderedShops] = useState<Shop[] | null>();
  const [detailsPopover, setDetailsPopover] = useState<DetailsPopover>(null);

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

  const handleOpenMenu = (currentTarget: HTMLElement, id: number) => {
    setDetailsPopover({ element: currentTarget, id });
  };

  const handleCloseMenu = () => {
    setDetailsPopover(null);
  };

  const actions = (id: number) => (
    <IconButton
      open={Boolean(detailsPopover)}
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
          <AddShopModal isReordering={isReordering} />
        </Stack>
        <Table
          id="users"
          headers={headers}
          isReordering={isReordering}
          isFetchingReorder={mutation.isLoading}
          data={reorderedShops ?? data?.data ?? []}
          elementShowingActions={detailsPopover?.id}
          renderActions={actions}
          onDrag={handleDrag}
          onStartReorder={handleStartReorder}
          onEndReorder={handleEndReorder}
        />
      </Stack>
      <Popover
        open={Boolean(detailsPopover)}
        anchorEl={detailsPopover?.element}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem onClick={() => navigate(`/app/shop/${detailsPopover?.id}`)}>
          <ListItemIcon>
            <AddBusinessIcon />
          </ListItemIcon>
          <TranslatedText ml={1} textKey="sections" />
        </MenuItem>
        <MenuItem
          onClick={() => {
            /* */
          }}
        >
          <ListItemIcon>
            <EditIcon />
          </ListItemIcon>
          <TranslatedText ml={1} textKey="edit" />
        </MenuItem>
        <MenuItem
          onClick={() => {
            /* */
          }}
        >
          <ListItemIcon>
            <DeleteIcon />
          </ListItemIcon>
          <TranslatedText ml={1} textKey="delete" />
        </MenuItem>
      </Popover>
    </>
  );
};
