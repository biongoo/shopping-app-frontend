import { Box, Stack, Unstable_Grid2 as Grid } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getLists } from '~/api';
import { Breadcrumbs, TranslatedText } from '~/bits';
import { generateOnError } from '~/utils';
import { AddList, Card } from './components';
import { list } from './mock-list';

const breadcrumbs = [{ key: 'home' }];

export const HomePage = () => {
  const lists = list.map((x, i) => <Card key={`list-${x.id}-${i}`} list={x} />);

  const listsQuery = useQuery({
    queryKey: ['lists'],
    queryFn: getLists,
    onError: generateOnError(),
  });

  listsQuery;

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
        {lists}
      </Grid>
    </Stack>
  );
};
