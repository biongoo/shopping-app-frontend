import {
  Box,
  CircularProgress,
  Stack,
  Unstable_Grid2 as Grid,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getLists } from '~/api';
import { Breadcrumbs, TranslatedText } from '~/bits';
import { QueryKey } from '~/enums';
import { generateOnError } from '~/utils';
import { AddList, Card } from './components';

const breadcrumbs = [{ key: 'home' }];

export const HomePage = () => {
  const listsQuery = useQuery({
    queryKey: [QueryKey.lists],
    queryFn: getLists,
    onError: generateOnError(),
  });

  const lists = listsQuery.data?.data ?? [];

  const cards = lists.map((x, i) => (
    <Card key={`list-${x.id}-${i}`} list={x} />
  ));

  if (listsQuery.isInitialLoading) {
    return (
      <Box textAlign="center">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Stack sx={{ flexGrow: 1 }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={3}
      >
        <Box>
          <TranslatedText variant="h5" gutterBottom textKey="shoppingLists" />
          <Breadcrumbs elements={breadcrumbs} />
        </Box>
        <AddList />
      </Stack>
      <Grid container spacing={2}>
        {cards}
      </Grid>
    </Stack>
  );
};
