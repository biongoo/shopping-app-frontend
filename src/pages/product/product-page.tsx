import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Box, CircularProgress, Stack } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '~/api';
import { Breadcrumbs, IconButton, Table, TranslatedText } from '~/bits';
import { QueryKey } from '~/enums';
import { ModifyData, Product } from '~/types';
import { useModal } from '~/utils';
import { AddProduct, ModifyProduct } from './components';

const breadcrumbs = [{ key: 'home' }, { key: 'products' }];

const getColumns = (
  setOpenOptions: (data?: ModifyData | undefined) => void,
  optionsId?: number
) =>
  Table.createColumns<Product>(() => [
    {
      dataKey: 'name',
      labelKey: 'name',
      isOrdering: true,
      width: 80,
      render: (x) => <>{x.name}</>,
    },
    {
      dataKey: 'type',
      labelKey: 'type',
      isOrdering: true,
      width: 20,
      render: (x) => <TranslatedText textKey={`productType.${x.type}`} />,
    },
    {
      dataKey: 'actions',
      labelKey: 'none',
      isOrdering: false,
      width: 0,
      py: 0,
      render: (x, _i, isReordering) => (
        <IconButton
          scale={0.9}
          placement="left"
          titleKey="options"
          disabled={isReordering}
          open={optionsId === x.id}
          onClick={(e) =>
            setOpenOptions({
              id: x.id,
              element: e.currentTarget,
            })
          }
        >
          <MoreVertIcon />
        </IconButton>
      ),
    },
  ]);

export const ProductPage = () => {
  const [options, setOpenOptions, setCloseOptions, setHideOptions] =
    useModal<ModifyData>();

  const { data, isLoading } = useQuery({
    queryKey: [QueryKey.products],
    queryFn: getProducts,
  });

  if (isLoading) {
    return (
      <Box textAlign="center">
        <CircularProgress />
      </Box>
    );
  }

  const products = data?.data ?? [];

  const optionsContent =
    options.isRender && options.data ? (
      <ModifyProduct
        data={options.data}
        products={products}
        isOpen={options.isOpen}
        onHide={setHideOptions}
        onClose={setCloseOptions}
      />
    ) : null;

  const optionsId = options.isOpen ? options.data?.id : undefined;

  return (
    <>
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
          <AddProduct />
        </Stack>
        <Table
          name="products"
          data={products}
          emptyKey="addYourProducts"
          defaultOrderBy="name"
          isShowingActions={options.isOpen}
          columns={getColumns(setOpenOptions, optionsId)}
        />
      </Stack>
      {optionsContent}
    </>
  );
};
