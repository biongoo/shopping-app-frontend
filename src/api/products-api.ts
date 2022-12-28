import { OrderType, ProductType, Unit } from '~/enums';
import i18n from '~/i18n';
import { ApiData } from '~/models';
import { Product, ProductWithOrder, Section, Shop } from '~/types';
import { connectApi } from './connect-api';

type GetSectionProductsDto = {
  sectionId: number;
};

type DeleteProductDto = {
  id: number;
};

type DeleteSectionProductDto = {
  id: number;
  sectionId: number;
};

type PatchProductDto = {
  id: number;
  name: string;
  units: Unit[];
  type: ProductType;
  sectionId?: number;
  listItemId?: number;
  orderType?: OrderType;
  orderAfterId?: number;
};

type PostProductsOrderDto = {
  sectionId: number;
  products: Array<{
    id: number;
    order: number;
  }>;
};

type ProductsWithShop = {
  shop: Shop;
  section: Section;
  products: ProductWithOrder[];
};

type PutSectionProductDto = {
  id: number;
  sectionId: number;
  orderType: OrderType;
  orderAfterId?: number;
};

export type PostProductDto = {
  name: string;
  units: Unit[];
  sectionId?: number;
  orderType?: OrderType;
  orderAfterId?: number;
};

export const getProducts = (): Promise<ApiData<Product[]>> =>
  connectApi({
    endpoint: `product?lang=${i18n.resolvedLanguage}`,
  });

export const getAvailableProducts = (
  body: GetSectionProductsDto
): Promise<ApiData<Product[]>> =>
  connectApi({
    endpoint: `product/available?sectionId=${body.sectionId}&lang=${i18n.resolvedLanguage}`,
  });

export const getSectionProducts = (
  body: GetSectionProductsDto
): Promise<ApiData<Product[]>> =>
  connectApi({
    endpoint: `product/section?sectionId=${body.sectionId}&lang=${i18n.resolvedLanguage}&withShop=false`,
  });

export const getSectionProductsWithShop = (
  body: GetSectionProductsDto
): Promise<ApiData<ProductsWithShop>> =>
  connectApi({
    endpoint: `product/section?sectionId=${body.sectionId}&lang=${i18n.resolvedLanguage}&withShop=true`,
  });

export const addProduct = (body: PostProductDto): Promise<ApiData<Product>> =>
  connectApi({
    endpoint: 'product',
    method: 'POST',
    body: {
      ...body,
      lang: i18n.resolvedLanguage,
    },
  });

export const editProduct = (
  body: PatchProductDto
): Promise<ApiData<Product>> => {
  return body.type === ProductType.global
    ? connectApi({
        endpoint: 'product/global',
        method: 'PATCH',
        body: {
          id: body.id,
          sectionId: body.sectionId,
          orderType: body.orderType,
          listItemId: body.listItemId,
          orderAfterId: body.orderAfterId,
        },
      })
    : connectApi({
        endpoint: 'product/local',
        method: 'PATCH',
        body: {
          id: body.id,
          name: body.name,
          units: body.units,
          sectionId: body.sectionId,
          orderType: body.orderType,
          lang: i18n.resolvedLanguage,
          listItemId: body.listItemId,
          orderAfterId: body.orderAfterId,
        },
      });
};

export const deleteProduct = (body: DeleteProductDto): Promise<ApiData> =>
  connectApi({
    endpoint: 'product',
    method: 'DELETE',
    body,
  });

export const reorderSectionProducts = (
  body: PostProductsOrderDto
): Promise<ApiData> =>
  connectApi({
    endpoint: 'product/section/reorder',
    method: 'POST',
    body,
  });

export const putSectionProduct = (
  body: PutSectionProductDto
): Promise<ApiData<Product>> =>
  connectApi({
    endpoint: 'product/section',
    method: 'PUT',
    body,
  });

export const deleteSectionProduct = (
  body: DeleteSectionProductDto
): Promise<ApiData> =>
  connectApi({
    endpoint: 'product/section',
    method: 'DELETE',
    body,
  });
