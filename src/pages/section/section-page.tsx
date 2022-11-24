import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Box, CircularProgress, Stack } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { getSectionsWithShop, reorderSections } from '~/api';
import { Breadcrumbs, IconButton, Table, TranslatedText } from '~/bits';
import { Section } from '~/types';
import {
  changeOrder,
  generateOnError,
  generateOnSuccess,
  hasOrderChanged,
  useModal,
} from '~/utils';
import { AddSection, ModifyData, ModifySection } from './components';

type Id = string | number;

const getColumns = (
  setOpenOptions: (data?: ModifyData | undefined) => void,
  optionsId?: number
) =>
  Table.createColumns<Section>(() => [
    {
      dataKey: 'orderNumber',
      labelKey: '#',
      isOrdering: true,
      width: 0,
      render: (x) => <>{x.orderNumber}</>,
    },
    {
      dataKey: 'name',
      labelKey: 'name',
      isOrdering: true,
      width: 100,
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
              shopId: x.shopId,
              element: e.currentTarget,
            })
          }
        >
          <MoreVertIcon />
        </IconButton>
      ),
    },
  ]);

export const SectionPage = () => {
  const { shopId } = useParams();
  const mutation = useMutation(reorderSections);
  const [reorderedSections, setReorderedSections] = useState<Section[]>();
  const isReordering = Boolean(reorderedSections);
  const [options, setOpenOptions, setCloseOptions, setHideOptions] =
    useModal<ModifyData>();

  if (!shopId || Number.isNaN(shopId)) {
    return <Navigate to="/" />;
  }

  const shopIdAsNumber = +shopId;

  const { data, isInitialLoading, refetch } = useQuery({
    queryKey: ['shop', shopIdAsNumber, { withShop: true }],
    queryFn: () => getSectionsWithShop({ shopId: shopIdAsNumber }),
    enabled: !isReordering,
    onError: generateOnError(),
  });

  if (isInitialLoading || !data) {
    return (
      <Box textAlign="center">
        <CircularProgress />
      </Box>
    );
  }

  const res = data.data;
  const breadcrumbs = [
    { key: 'home' },
    { key: 'shops', href: 'shop' },
    { key: res.shop.name, ignoreTranslation: true },
  ];

  const handleStartReorder = () => {
    setReorderedSections(res.sections);
  };

  const handleDrag = (firstId: Id, secondId: Id) => {
    setReorderedSections(changeOrder(firstId, secondId));
  };

  const handleEndReorder = async () => {
    if (!reorderedSections || mutation.isLoading) {
      return;
    }

    if (!hasOrderChanged(reorderedSections, res.sections)) {
      setReorderedSections(undefined);
      return;
    }

    const data = {
      shopId: shopIdAsNumber,
      sections: reorderedSections.map((x) => ({
        id: x.id,
        orderNumber: x.orderNumber,
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

    setReorderedSections(undefined);
  };

  const optionsContent =
    options.isRender && options.data ? (
      <ModifySection
        data={options.data}
        isOpen={options.isOpen}
        sections={res.sections}
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
            <TranslatedText variant="h5" gutterBottom textKey="sections" />
            <Breadcrumbs elements={breadcrumbs} />
          </Box>
          <AddSection
            shopId={shopIdAsNumber}
            isReordering={isReordering}
            sections={res.sections}
          />
        </Stack>
        <Table
          name="sections"
          emptyKey="addYourSections"
          isReordering={isReordering}
          defaultOrderBy="orderNumber"
          isShowingActions={options.isOpen}
          isFetchingReorder={mutation.isLoading}
          data={reorderedSections ?? res.sections}
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
