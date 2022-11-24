import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Box, Stack } from '@mui/material';
import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Breadcrumbs, IconButton, Table, TranslatedText } from '~/bits';
import { ProductType } from '~/enums';
import { Product } from '~/types';
import { useModal } from '~/utils';
import { ModifyData } from './components';
import { mockProducts } from './mock-products';

const breadcrumbs = [{ key: 'home' }, { key: 'products' }];

const getColumns = (
  t: TFunction<'translation', undefined>,
  setOpenOptions: (data?: ModifyData | undefined) => void,
  optionsId?: number
) =>
  Table.createColumns<Product>(() => [
    {
      dataKey: 'name',
      labelKey: 'name',
      isOrdering: true,
      width: 100,
      render: (x) => <>{x.name}</>,
    },
    {
      dataKey: 'type',
      labelKey: 'type',
      isOrdering: true,
      width: 0,
      render: (x) => (
        <>{t(x.type === ProductType.global ? 'global' : 'local')}</>
      ),
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
  const { t } = useTranslation();
  const [options, setOpenOptions, setCloseOptions, setHideOptions] =
    useModal<ModifyData>();

  const optionsId = options.isOpen ? options.data?.id : undefined;

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
        emptyKey="addYourProducts"
        defaultOrderBy="name"
        isShowingActions={options.isOpen}
        columns={getColumns(t, setOpenOptions, optionsId)}
      />
    </Stack>
  );
};
