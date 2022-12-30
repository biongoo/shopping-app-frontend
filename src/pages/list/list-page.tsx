import {
  Box,
  CircularProgress,
  List,
  ListSubheader,
  Stack,
  Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { Navigate, useParams } from 'react-router-dom';
import { getList } from '~/api';
import { Breadcrumbs } from '~/bits';
import { QueryKey } from '~/enums';
import { ListItem, ModifyData } from '~/types';
import { generateOnError, useModal } from '~/utils';
import { AddListItem, Item, ModifyListItem } from './components';

export const ListPage = () => {
  const { listId } = useParams();
  const [options, setOpenOptions, setCloseOptions, setHideOptions] =
    useModal<ModifyData>();

  if (!listId || Number.isNaN(listId)) {
    return <Navigate to="/" />;
  }

  const listIdAsNumber = Number(listId);

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

  const handleToggle = (value: number) => {};

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
        <List
          sx={{
            width: '100%',
            bgcolor: 'background.paper',
            position: 'relative',
            overflow: 'auto',
            borderRadius: 2,
            '& ul': { padding: 0 },
          }}
          subheader={<li />}
        >
          {shops}
        </List>
      </Stack>
      {optionsContent}
    </>
  );
};
