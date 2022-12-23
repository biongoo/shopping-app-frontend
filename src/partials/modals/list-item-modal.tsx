import DashboardIcon from '@mui/icons-material/Dashboard';
import EditIcon from '@mui/icons-material/Edit';
import StoreIcon from '@mui/icons-material/Store';
import {
  Box,
  List,
  ListItem as ListItemMui,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Popover,
  Stack,
  ToggleButton,
  ToggleButtonGroup as ToggleButtonGroupMui,
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { getProducts, getSections, getShops, putListItem } from '~/api';
import {
  Autocomplete,
  ButtonGroup,
  FormModal,
  IconButton,
  Input,
  ToggleButtonGroup,
  TranslatedText,
} from '~/bits';
import { QueryKey, Unit } from '~/enums';
import {
  AddProductModal,
  AddSectionModal,
  AddShopModal,
  EditProductModal,
} from '~/partials';
import { ListItem, Product } from '~/types';
import {
  generateOnError,
  generateOnSuccess,
  useClearCache,
  useExistsItem,
  useModal,
} from '~/utils';

type Props = {
  listId: number;
  isOpen: boolean;
  listItem?: ListItem;
  onHide: () => void;
  onOpen: () => void;
  onClose: () => void;
};

type ListItemInputs = {
  count: string;
  unit: Unit | null;
  description: string;
  unitSizeType: number;
  shopId: number | null;
  productId: number | null;
  sectionId: number | null;
};

export const ListItemModal = (props: Props) => {
  const { listId, isOpen, listItem, onClose, onHide, onOpen } = props;
  const mutation = useMutation(putListItem);
  const clearCache = useClearCache(QueryKey.lists);
  const [isOnceEditing, setIsOnceEditing] = useState(false);
  const [productModal, setOpenProduct, setCloseProduct, setHideProduct] =
    useModal<string | Product>();
  const [options, setOpenOptions, setCloseOptions] =
    useModal<HTMLElement | null>();
  const [shopModal, setOpenShop, setCloseShop] = useModal<string>();
  const [sectionModal, setOpenSection, setCloseSection] = useModal<string>();
  const { control, reset, watch, setError, setValue, handleSubmit } =
    useForm<ListItemInputs>({
      defaultValues: {
        productId: listItem?.productId ?? null,
        shopId: listItem?.shopId ?? null,
        sectionId: listItem?.sectionId ?? null,
        unit: listItem?.unit ?? null,
        count: listItem?.count.toString() ?? '',
        unitSizeType: 1,
        description: '',
      },
    });

  const unit = watch('unit');
  const shopId = watch('shopId');
  const productId = watch('productId');
  const sectionId = watch('sectionId');

  const { products, shops, sections } = useQueries(shopId);

  const product = products.data.find((x) => x.id === productId);
  const shop = shops.data.find((x) => x.id === shopId);
  const section = sections.data.find((x) => x.id === sectionId);

  const isShop = shop !== undefined;
  const isProduct = product !== undefined;
  const isSection = section !== undefined;
  const isUnit = typeof unit === 'number';

  useEffect(() => {
    const isSameProduct = product?.id === listItem?.productId;

    const shopId = isSameProduct ? listItem?.shopId : product?.shopId;
    setValue('shopId', shopId ?? null, {
      shouldValidate: Boolean(shopId),
    });

    const sectionId = isSameProduct ? listItem?.sectionId : product?.sectionId;
    setValue('sectionId', sectionId ?? null, {
      shouldValidate: Boolean(sectionId),
    });

    const unit = isSameProduct ? listItem?.unit : null;
    if (product?.units.length === 1) {
      setValue('unit', product?.units.find(() => true) ?? null, {
        shouldValidate: true,
      });
    } else {
      setValue('unit', unit ?? null, {
        shouldValidate: Boolean(unit),
      });
    }

    const count = isSameProduct ? listItem?.count : '';
    setValue('count', count?.toString() ?? '', {
      shouldValidate: Boolean(count),
    });

    // TODO unitSizeType

    const description = isSameProduct ? listItem?.description : '';
    setValue('description', description ?? '', {
      shouldValidate: Boolean(description),
    });

    setIsOnceEditing(false);
  }, [productId, product?.shopId, product?.sectionId]);

  useEffect(() => {
    if (product?.shopId === shopId) {
      setValue('sectionId', product?.sectionId ?? null, {
        shouldValidate: Boolean(product?.sectionId),
      });
    } else {
      setValue('sectionId', null);
    }
  }, [shopId]);

  // TODO useEffect to change unit to change unitSizeType

  const [productIdToUpdate, setProductIdToUpdate] = useExistsItem(
    products.data,
    (x) => setValue('productId', x, { shouldValidate: true })
  );

  const [shopIdToUpdate, setShopIdToUpdate] = useExistsItem(shops.data, (x) =>
    setValue('shopId', x, { shouldValidate: true })
  );

  const [sectionIdToUpdate, setSectionIdToUpdate] = useExistsItem(
    sections.data,
    (x) => setValue('sectionId', x, { shouldValidate: true })
  );

  const handleOpenProduct = (name: string) => {
    onHide();
    setTimeout(() => setOpenProduct(name), 200);
  };

  const handleCloseProduct = (productId?: number) => {
    setCloseProduct();
    setProductIdToUpdate(productId);
    setTimeout(onOpen, 200);
  };

  const handleOpenShop = (name: string) => {
    onHide();
    setTimeout(() => setOpenShop(name), 200);
  };

  const handleCloseShop = (shopId?: number) => {
    setCloseShop();
    setShopIdToUpdate(shopId);
    setTimeout(onOpen, 200);
  };

  const handleOpenSection = (name: string) => {
    onHide();
    setTimeout(() => setOpenSection(name), 200);
  };

  const handleCloseSection = (sectionId?: number) => {
    setCloseSection();
    setSectionIdToUpdate(sectionId);
    setTimeout(onOpen, 200);
  };

  const handleOpenEditOnce = (fromOptions?: boolean) => {
    if (fromOptions) {
      setCloseOptions();
    }
    setIsOnceEditing(true);
  };

  const handleOpenEditGlobal = (fromOptions?: boolean) => {
    if (fromOptions) {
      setCloseOptions();
    }
    onHide();
    setTimeout(() => setOpenProduct(product), 200);
  };

  const onSubmit = (data: ListItemInputs) => {
    const { count, description, productId, sectionId, unit } = data;
    const countAsNumber = Number(count);

    if (
      !count ||
      !description ||
      !productId ||
      !sectionId ||
      !unit ||
      Number.isNaN(countAsNumber)
    ) {
      return;
    }

    const preparedData = {
      unit,
      listId,
      productId,
      sectionId,
      description,
      count: countAsNumber,
    };

    mutation.mutate(preparedData, {
      onSuccess: generateOnSuccess({
        alertTime: 5,
        message: 'successfullyAdded',
        reset,
        fn: () => {
          clearCache();
          onClose();
        },
      }),
      onError: generateOnError({ setError }),
    });
  };

  const productInfo = isProduct ? (
    <List
      dense={true}
      subheader={
        <TranslatedText textKey="information" color="text.secondary" />
      }
      sx={{
        '& .MuiListItemIcon-root': {
          minWidth: 40,
        },
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box>
          <ListItemMui>
            <ListItemIcon>
              <StoreIcon />
            </ListItemIcon>
            <ListItemText
              primary={shop?.name ?? <CircularProgress size="1rem" />}
            />
          </ListItemMui>
          <ListItemMui>
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText
              primary={section?.name ?? <CircularProgress size="1rem" />}
            />
          </ListItemMui>
        </Box>
        <IconButton
          titleKey="edit"
          placement="left"
          open={options.isOpen}
          onClick={(e) => setOpenOptions(e.currentTarget)}
        >
          <EditIcon />
        </IconButton>
      </Stack>
    </List>
  ) : null;

  const editPopover = options.isRender ? (
    <Popover
      open={options.isOpen}
      anchorEl={options.data}
      onClose={setCloseOptions}
      anchorOrigin={{ vertical: 'center', horizontal: 'left' }}
      transformOrigin={{ vertical: 'center', horizontal: 'right' }}
      PaperProps={{
        sx: {
          p: 1,
          '& .MuiMenuItem-root': {
            px: 1,
            typography: 'body2',
            borderRadius: 0.75,
          },
        },
      }}
    >
      <MenuItem onClick={() => handleOpenEditOnce(true)}>
        <TranslatedText ml={1} textKey="once" />
      </MenuItem>
      <MenuItem onClick={() => handleOpenEditGlobal(true)}>
        <TranslatedText ml={1} textKey="global" />
      </MenuItem>
    </Popover>
  ) : null;

  const shopInput = isProduct ? (
    <Autocomplete
      name="shopId"
      titleKey="shop"
      required={true}
      control={control}
      dynamicAdd={{
        defaultValue: -1,
        emptyAddKey: 'addShop',
        onAddNewItem: handleOpenShop,
      }}
      isInitialFetching={shops.isInitialLoading || shopIdToUpdate !== undefined}
      options={shops.data.map((x) => ({
        value: x.id,
        label: x.name,
      }))}
    />
  ) : null;

  const sectionsInput = isShop ? (
    <Autocomplete
      required={true}
      name="sectionId"
      control={control}
      titleKey="section"
      dynamicAdd={{
        defaultValue: -1,
        emptyAddKey: 'addSection',
        onAddNewItem: handleOpenSection,
      }}
      isInitialFetching={
        sections.isInitialLoading || sectionIdToUpdate !== undefined
      }
      options={sections.data.map((x) => ({
        value: x.id,
        label: x.name,
      }))}
    />
  ) : null;

  const unitInput =
    isProduct && isSection ? (
      <ToggleButtonGroup
        fullWidth
        name="unit"
        multiple={false}
        titleKey="unit"
        control={control}
        options={product.units}
        translationKey="enumUnit"
      />
    ) : null;

  const countInput =
    isProduct && isSection && isUnit ? (
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="stretch"
        sx={{
          '& .MuiInputBase-root': {
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
          },
          '& .MuiToggleButtonGroup-root > button:first-of-type': {
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
          },
        }}
      >
        <Input fullWidth name="count" labelKey="count" control={control} />
        <ToggleButtonGroupMui
          value={'left'}
          exclusive
          /* onChange={handleAlignment} */
          aria-label="text alignment"
        >
          <ToggleButton value="left" aria-label="left aligned">
            G
          </ToggleButton>
          <ToggleButton value="center" aria-label="centered">
            DAG
          </ToggleButton>
          <ToggleButton value="right" aria-label="right aligned">
            KG
          </ToggleButton>
        </ToggleButtonGroupMui>
      </Stack>
    ) : null;

  const addProductContent = productModal.isRender ? (
    typeof productModal.data === 'string' ? (
      <AddProductModal
        isOpen={productModal.isOpen}
        defaultName={productModal.data}
        onClose={handleCloseProduct}
        onHide={setHideProduct}
        onOpen={setOpenProduct}
      />
    ) : (
      <EditProductModal
        product={product}
        isOpen={productModal.isOpen}
        onClose={handleCloseProduct}
        onHide={setHideProduct}
        onOpen={setOpenProduct}
      />
    )
  ) : null;

  const addShopContent = shopModal.isRender ? (
    <AddShopModal
      isOpen={shopModal.isOpen}
      defaultName={shopModal.data}
      onClose={handleCloseShop}
    />
  ) : null;

  const addSectionContent =
    sectionModal.isRender && isShop ? (
      <AddSectionModal
        shopId={shop.id}
        isOpen={sectionModal.isOpen}
        defaultName={sectionModal.data}
        onClose={handleCloseSection}
      />
    ) : null;

  let productContent: React.ReactNode = null;

  if (product) {
    if (isOnceEditing) {
      productContent = (
        <>
          {shopInput}
          {sectionsInput}
          {unitInput}
          {countInput}
        </>
      );
    } else if (product.sectionId) {
      productContent = (
        <>
          {productInfo}
          {unitInput}
          {countInput}
        </>
      );
    } else {
      productContent = (
        <Box>
          <TranslatedText
            textKey="assignProduct"
            color="text.secondary"
            mb={0.8}
          />
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <ButtonGroup
              buttons={[
                { textKey: 'global', onClick: handleOpenEditGlobal },
                { textKey: 'once', onClick: handleOpenEditOnce },
              ]}
            />
          </Box>
        </Box>
      );
    }
  }

  return (
    <>
      <FormModal
        isOpen={isOpen}
        isLoading={mutation.isLoading}
        titleKey={listItem ? 'editProduct' : 'addProduct'}
        reset={reset}
        onClose={onClose}
        handleSubmit={handleSubmit(onSubmit)}
      >
        <Stack spacing={2} direction="column">
          <Autocomplete
            required={true}
            name="productId"
            control={control}
            titleKey="product"
            dynamicAdd={{
              defaultValue: -1,
              emptyAddKey: 'addProduct',
              onAddNewItem: handleOpenProduct,
            }}
            isInitialFetching={
              products.isInitialLoading || productIdToUpdate !== undefined
            }
            options={products.data.map((x) => ({
              value: x.id,
              label: x.name,
            }))}
          />
          {productContent}
        </Stack>
      </FormModal>
      {editPopover}
      {addProductContent}
      {addShopContent}
      {addSectionContent}
    </>
  );
};

const useQueries = (shopId: number | null) => {
  const isShop = typeof shopId === 'number';

  const productsQuery = useQuery({
    queryKey: [QueryKey.products],
    queryFn: getProducts,
    onError: generateOnError(),
  });

  const shopsQuery = useQuery({
    queryKey: [QueryKey.shops],
    queryFn: getShops,
    onError: generateOnError(),
  });

  const sectionsQuery = useQuery({
    queryKey: [QueryKey.sections, shopId],
    queryFn: () => (isShop ? getSections({ shopId }) : undefined),
    onError: generateOnError(),
    enabled: isShop,
  });

  const products = productsQuery.data?.data ?? [];
  const shops = shopsQuery.data?.data ?? [];
  const sections = sectionsQuery.data?.data ?? [];

  return {
    products: {
      data: products,
      isInitialLoading: productsQuery.isInitialLoading,
    },
    shops: {
      data: shops,
      isInitialLoading: shopsQuery.isInitialLoading,
    },
    sections: {
      data: sections,
      isInitialLoading: sectionsQuery.isInitialLoading,
    },
  };
};
