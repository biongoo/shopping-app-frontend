import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Box, CircularProgress, Stack } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { getSectionsWithShop, reorderSections } from '~/api';
import { Breadcrumbs, IconButton, Table, TranslatedText } from '~/bits';
import { QueryKey } from '~/enums';
import { ModifyData, Section } from '~/types';
import {
  changeOrder,
  generateOnError,
  generateOnSuccess,
  hasOrderChanged,
  Id,
  useModal,
} from '~/utils';
import { AddSection, ModifySection } from './components';

const getColumns = (
  setOpenOptions: (data?: ModifyData | undefined) => void,
  optionsId?: number
) =>
  Table.createColumns<Section>(() => [
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
  const mutation = useMutation({ mutationFn: reorderSections });
  const [reorderedSections, setReorderedSections] = useState<Section[]>();
  const isReordering = Boolean(reorderedSections);
  const [options, setOpenOptions, setCloseOptions, setHideOptions] =
    useModal<ModifyData>();

  if (!shopId || Number.isNaN(shopId)) {
    return <Navigate to="/" />;
  }

  const shopIdAsNumber = +shopId;

  const { data, isLoading, refetch } = useQuery({
    queryKey: [QueryKey.sections, shopIdAsNumber, { withShop: true }],
    queryFn: () => getSectionsWithShop({ shopId: shopIdAsNumber }),
    enabled: !isReordering,
  });

  if (isLoading) {
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
    if (!reorderedSections || mutation.isPending) {
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
          <AddSection shopId={shopIdAsNumber} isReordering={isReordering} />
        </Stack>
        <Table
          name="sections"
          defaultOrderBy="order"
          emptyKey="addYourSections"
          isReordering={isReordering}
          isShowingActions={options.isOpen}
          isFetchingReorder={mutation.isPending}
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
