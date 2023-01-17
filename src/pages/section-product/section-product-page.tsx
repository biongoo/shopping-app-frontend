import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Box, CircularProgress, Stack } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { getSectionProductsWithShop, reorderSectionProducts } from '~/api';
import { Breadcrumbs, IconButton, Table, TranslatedText } from '~/bits';
import { QueryKey } from '~/enums';
import { ModifyData, ProductWithOrder } from '~/types';
import {
  changeOrder,
  generateOnError,
  generateOnSuccess,
  hasOrderChanged,
  Id,
  useModal,
} from '~/utils';
import { AddSectionProduct, ModifySectionProduct } from './components';

const getColumns = (
  setOpenOptions: (data?: ModifyData | undefined) => void,
  optionsId?: number
) =>
  Table.createColumns<ProductWithOrder>(() => [
    {
      dataKey: 'order',
      labelKey: '#',
      isOrdering: true,
      width: 0,
      render: (x) => <>{x.order}</>,
    },
    {
      dataKey: 'name',
      labelKey: 'name',
      isOrdering: true,
      width: 80,
      render: (x) => <>{x.name}</>,
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

export const SectionProductPage = () => {
  const { shopId, sectionId } = useParams();
  const mutation = useMutation(reorderSectionProducts);
  const [reorderedProducts, setReorderedProducts] =
    useState<ProductWithOrder[]>();
  const isReordering = Boolean(reorderedProducts);
  const [options, setOpenOptions, setCloseOptions, setHideOptions] =
    useModal<ModifyData>();

  if (
    !shopId ||
    !sectionId ||
    Number.isNaN(shopId) ||
    Number.isNaN(sectionId)
  ) {
    return <Navigate to="/" />;
  }

  const shopIdAsNumber = +shopId;
  const sectionIdIdAsNumber = +sectionId;

  const { data, isInitialLoading, refetch } = useQuery({
    queryKey: [
      QueryKey.sectionProducts,
      sectionIdIdAsNumber,
      { withShop: true },
    ],
    queryFn: () =>
      getSectionProductsWithShop({ sectionId: sectionIdIdAsNumber }),
    enabled: !isReordering,
    onError: generateOnError(),
  });

  if (isInitialLoading) {
    return (
      <Box textAlign="center">
        <CircularProgress />
      </Box>
    );
  }

  if (!data) {
    return <Navigate to="/404" />;
  }

  const res = data.data;
  const products = res.products;
  const breadcrumbs = [
    { key: 'home' },
    { key: 'shops', href: 'shop' },
    {
      key: res.shop.name,
      ignoreTranslation: true,
      href: `shop/${shopIdAsNumber}`,
    },
    { key: res.section.name, ignoreTranslation: true },
  ];

  const handleStartReorder = () => {
    setReorderedProducts(products);
  };

  const handleDrag = (firstId: Id, secondId: Id) => {
    setReorderedProducts(changeOrder(firstId, secondId));
  };

  const handleEndReorder = async () => {
    if (!reorderedProducts || mutation.isLoading) {
      return;
    }

    if (!hasOrderChanged(reorderedProducts, products)) {
      setReorderedProducts(undefined);
      return;
    }

    const data = {
      sectionId: sectionIdIdAsNumber,
      products: reorderedProducts.map((x) => ({
        id: x.id,
        order: x.order,
      })),
    };

    const mutateRes = await mutation.mutateAsync(data, {
      onSuccess: generateOnSuccess({
        message: 'successfullyReordered',
      }),
      onError: generateOnError(),
    });

    if (mutateRes.status === 'ok') {
      await refetch();
    }

    setReorderedProducts(undefined);
  };

  const optionsContent =
    options.isRender && options.data ? (
      <ModifySectionProduct
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
      <Stack sx={{ height: '100%' }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={4}
        >
          <Box>
            <TranslatedText
              variant="h5"
              gutterBottom
              textKey="sectionProducts"
            />
            <Breadcrumbs elements={breadcrumbs} />
          </Box>
          <AddSectionProduct
            isReordering={isReordering}
            sectionId={sectionIdIdAsNumber}
          />
        </Stack>
        <Table
          name="products"
          defaultOrderBy="order"
          emptyKey="addYourProducts"
          isReordering={isReordering}
          isShowingActions={options.isOpen}
          isFetchingReorder={mutation.isLoading}
          data={reorderedProducts ?? products}
          columns={getColumns(setOpenOptions, optionsId)}
          onDrag={handleDrag}
          onEndReorder={handleEndReorder}
          onStartReorder={handleStartReorder}
        />
      </Stack>
      {optionsContent}
    </>
  );
};
