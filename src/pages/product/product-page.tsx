import { Box, Stack } from '@mui/material';
import { Breadcrumbs, TranslatedText, Table } from '~/bits';
import { Product } from '~/types';
import { mockProducts } from './mock-products';

const breadcrumbs = [{ key: 'home' }, { key: 'products' }];

const getColumns = () =>
  Table.createColumns<Product>(() => [
    {
      dataKey: 'name',
      labelKey: 'name',
      isOrdering: true,
      width: 20,
      render: (x) => <>{x.name}</>,
    },
    {
      dataKey: 'name',
      labelKey: 'name',
      isOrdering: true,
      width: 30,
      render: (x) => <>{x.name}</>,
    },
    {
      dataKey: 'name',
      labelKey: 'name',
      isOrdering: true,
      width: 50,
      render: (x) => <>{x.name}</>,
    },
  ]);

export const ProductPage = () => {
  return (
    <Stack sx={{ flexGrow: 1, overflow: 'auto' }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={4}
      >
        <Box>
          <TranslatedText variant="h5" gutterBottom textKey="products" />
          <Breadcrumbs elements={breadcrumbs} />
        </Box>
      </Stack>
      <Table
        name="products"
        data={mockProducts}
        columns={getColumns()}
        emptyKey="addYourProducts"
      />
    </Stack>
  );
};
