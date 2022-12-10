import { Box, Stack, Unstable_Grid2 as Grid } from '@mui/material';
import { Breadcrumbs, TranslatedText } from '~/bits';
import { Card } from './components';
import { list } from './mock-list';

const breadcrumbs = [{ key: 'home' }];

export const HomePage = () => {
  const lists = list.map((x, i) => <Card key={`list-${x.id}-${i}`} list={x} />);

  return (
    <Stack sx={{ flexGrow: 1 }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
      >
        <Box>
          <TranslatedText variant="h5" gutterBottom textKey="shoppingLists" />
          <Breadcrumbs elements={breadcrumbs} />
        </Box>
      </Stack>
      <Grid container spacing={2}>
        {lists}
      </Grid>
    </Stack>
  );
};
