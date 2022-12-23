import {
  Box,
  CircularProgress,
  Divider,
  List,
  ListSubheader,
  Stack,
  Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { getList } from '~/api';
import { Breadcrumbs } from '~/bits';
import { QueryKey } from '~/enums';
import { ListItem } from '~/types';
import { generateOnError } from '~/utils';
import { AddListItem, Item } from './components';

export const ListPage = () => {
  const { listId } = useParams();
  const [checked, setChecked] = React.useState([0]);

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

  const handleToggle = (value: number) => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const shops = list.shops.map((shop, i) => {
    const items: ListItem[] = [];

    for (const section of shop.sections) {
      items.push(...section.items);
    }

    const shopContent = items.map((item, index) => (
      <div key={`item-${item.id}-${index}`}>
        <Item item={item} onCheck={handleToggle} />
        {index + 1 === items.length ? null : <Divider />}
      </div>
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

  return (
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
          '& ul': { padding: 0 },
        }}
        subheader={<li />}
      >
        {shops}
      </List>
    </Stack>
  );
};
