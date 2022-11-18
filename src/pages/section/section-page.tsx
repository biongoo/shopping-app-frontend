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

const headers = [
  { labelKey: 'orderNumber', isOrdering: true },
  { labelKey: 'name', isOrdering: true },
];

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

  const actions = (id: number) => (
    <IconButton
      scale={0.9}
      placement="left"
      titleKey="options"
      disabled={isReordering}
      open={options.data?.id === id}
      onClick={(e) =>
        setOpenOptions({
          id,
          shopId: shopIdAsNumber,
          element: e.currentTarget,
        })
      }
    >
      <MoreVertIcon />
    </IconButton>
  );

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
          id="users"
          columns={3}
          headers={headers}
          emptyKey="addYourSections"
          isReordering={isReordering}
          isFetchingReorder={mutation.isLoading}
          elementShowingActions={options.data?.id}
          data={reorderedSections ?? res.sections}
          onDrag={handleDrag}
          renderActions={actions}
          onStartReorder={handleStartReorder}
          onEndReorder={handleEndReorder}
        />
      </Stack>
      {optionsContent}
    </>
  );
};
