import {
  Box,
  CircularProgress,
  Stack,
  Unstable_Grid2 as Grid,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import Lottie from 'lottie-react';
import { getLists } from '~/api';
import tumbleweed from '~/assets/lotties/tumbleweed.json';
import { Breadcrumbs, TranslatedText } from '~/bits';
import { QueryKey } from '~/enums';
import { AddList, Card } from './components';

const breadcrumbs = [{ key: 'home' }];

export const HomePage = () => {
  const listsQuery = useQuery({
    queryKey: [QueryKey.lists],
    queryFn: getLists,
  });

  const lists = listsQuery.data?.data ?? [];

  if (listsQuery.isLoading) {
    return (
      <Box textAlign="center">
        <CircularProgress />
      </Box>
    );
  }

  const cards = lists.map((x, i) => (
    <Card key={`list-${x.id}-${i}`} list={x} />
  ));

  const content =
    lists.length > 0 ? (
      <Grid container spacing={2}>
        {cards}
      </Grid>
    ) : (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '70%',
        }}
      >
        <Lottie
          loop={true}
          animationData={tumbleweed}
          style={{ width: '80%', maxWidth: 600 }}
        />
      </Box>
    );

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
      {content}
    </Stack>
  );
};
