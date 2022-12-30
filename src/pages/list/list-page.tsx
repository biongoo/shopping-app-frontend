import {
  Box,
  CircularProgress,
  List as ListMui,
  ListSubheader,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Navigate, useParams } from 'react-router-dom';
import { checkItem, getList, PostCheckListItem } from '~/api';
import { Breadcrumbs, TranslatedText } from '~/bits';
import { QueryKey } from '~/enums';
import { ApiData } from '~/models';
import { List, ListItem, ModifyData } from '~/types';
import { generateOnError, useModal } from '~/utils';
import { AddListItem, Item, ModifyListItem } from './components';

export const ListPage = () => {
  const { listId } = useParams();
  const queryClient = useQueryClient();
  const [options, setOpenOptions, setCloseOptions, setHideOptions] =
    useModal<ModifyData>();

  if (!listId || Number.isNaN(listId)) {
    return <Navigate to="/" />;
  }

  const listIdAsNumber = Number(listId);

  const mutation = useMutation({
    mutationFn: checkItem,
    onMutate: async (item) => {
      await queryClient.cancelQueries({ queryKey: [QueryKey.lists] });
      await queryClient.cancelQueries({
        queryKey: [QueryKey.lists, listIdAsNumber],
      });

      queryClient.setQueryData<ApiData<List>>(
        [QueryKey.lists, listIdAsNumber],
        (old) => {
          const oldItem = old?.data.shops
            .find((shop) => shop.id === item.shopId)
            ?.sections.find((section) => section.id === item.sectionId)
            ?.items.find((x) => x.id === item.id);

          if (oldItem) {
            oldItem.checked = item.checked;
          }

          return old;
        }
      );
    },
    onError: generateOnError(),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.lists] });
    },
  });

  const { data, isInitialLoading } = useQuery({
    queryKey: [QueryKey.lists, listIdAsNumber],
    queryFn: () => getList({ id: listIdAsNumber }),
    onError: generateOnError(),
  });

  if (isInitialLoading) {
    return (
      <Box textAlign="center">
        <CircularProgress />
      </Box>
    );
  }

  const list = data?.data;

  if (!list) {
    return <Navigate to="home" />;
  }

  const breadcrumbs = [
    { key: 'home' },
    { key: list.name, ignoreTranslation: true },
  ];

  const handleToggle = (item: ListItem) => {
    const preparedData = {
      id: item.id,
      shopId: item.shopId,
      checked: !item.checked,
      sectionId: item.sectionId,
    } satisfies PostCheckListItem;

    mutation.mutate(preparedData);
  };

  const listItems: ListItem[] = [];

  const shops = list.shops.map((shop, i) => {
    const shopItems: ListItem[] = [];

    for (const section of shop.sections) {
      shopItems.push(...section.items);
      listItems.push(...section.items);
    }

    const shopContent = shopItems.map((item, index) => (
      <Item
        key={`item-${item.id}-${index}`}
        item={item}
        onCheck={handleToggle}
        setOpenOptions={setOpenOptions}
      />
    ));

    return (
      <li key={`shop-${shop.id}-${i}`}>
        <ul>
          <ListSubheader>{shop.name}</ListSubheader>
          {shopContent}
        </ul>
      </li>
    );
  });

  const optionsContent =
    options.isRender && options.data ? (
      <ModifyListItem
        listId={list.id}
        data={options.data}
        listItems={listItems}
        isOpen={options.isOpen}
        onHide={setHideOptions}
        onClose={setCloseOptions}
      />
    ) : null;

  const content =
    listItems.length > 0 ? (
      <ListMui
        sx={{
          width: '100%',
          bgcolor: 'background.paper',
          position: 'relative',
          overflow: 'auto',
          borderRadius: 1,
          '& ul': { padding: 0 },
        }}
        subheader={<li />}
      >
        {shops}
      </ListMui>
    ) : (
      <Paper
        sx={{
          px: 2,
          py: 1.5,
          width: 1,
          display: 'flex',
          justifyContent: 'center',
          backgroundImage: 'none',
        }}
      >
        <TranslatedText textKey="emptyList" />
      </Paper>
    );

  return (
    <>
      <Stack sx={{ flexGrow: 1, overflow: 'hidden' }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={4}
        >
          <Box>
            <Typography variant="h5" gutterBottom>
              {list.name}
            </Typography>
            <Breadcrumbs elements={breadcrumbs} />
          </Box>
          <AddListItem listId={listIdAsNumber} />
        </Stack>
        {content}
      </Stack>
      {optionsContent}
    </>
  );
};
