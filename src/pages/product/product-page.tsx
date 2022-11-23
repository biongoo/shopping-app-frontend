import { Box, Stack } from '@mui/material';
import { Breadcrumbs, TranslatedText, Table } from '~/bits';
import { Product } from '~/types';
import { mockProducts } from './mock-products';

const breadcrumbs = [{ key: 'home' }, { key: 'products' }];
const products = mockProducts;

const getColumns = () =>
  Table.createColumns<Product>(() => [
    {
      dataKey: 'name',
      labelKey: 'name',
      isOrdering: true,
      width: 2,
      render: (x) => <>{x.name}</>,
    },
    {
      dataKey: 'name',
      labelKey: 'name',
      isOrdering: true,
      render: (x) => <>{x.name}</>,
    },
    {
      dataKey: 'name',
      labelKey: 'name',
      isOrdering: true,
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
        data={products}
        columns={getColumns()}
        emptyKey="addYourProducts"
      />
    </Stack>
  );
};
