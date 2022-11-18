import { OrderType } from '~/enums';
import { ApiData } from '~/models';
import { ShopSection } from '~/types';
import { connectApi } from './connect-api';

type GetShopSectionDto = {
  shopId: number;
};

type PostShopSectionDto = {
  name: string;
  shopId: number;
  orderType: OrderType;
  orderAfterId?: number;
};

type PatchShopSectionDto = {
  name: string;
  shopId: number;
  orderType: OrderType;
  shopSectionId: number;
  orderAfterId?: number;
};

type DeleteShopSectionDto = {
  shopId: number;
  shopSectionId: number;
};

type PostShopSectionsOrderDto = {
  shopId: number;
  shops: Array<{
    id: number;
    orderNumber: number;
  }>;
};

export const getShopSections = (
  body: GetShopSectionDto
): Promise<ApiData<ShopSection[]>> =>
  connectApi({
    endpoint: `shop/section?shopId=${body.shopId}`,
  });

export const addShopSection = (
  body: PostShopSectionDto
): Promise<ApiData<ShopSection>> =>
  connectApi({
    endpoint: 'shop/section',
    method: 'POST',
    body,
  });

export const editShopSection = (
  body: PatchShopSectionDto
): Promise<ApiData<ShopSection>> =>
  connectApi({
    endpoint: 'shop/section',
    method: 'PATCH',
    body,
  });

export const deleteShopSection = (
  body: DeleteShopSectionDto
): Promise<ApiData> =>
  connectApi({
    endpoint: 'shop/section',
    method: 'DELETE',
    body,
  });

export const reorderShopSections = (
  body: PostShopSectionsOrderDto
): Promise<ApiData> =>
  connectApi({
    endpoint: 'shop/section/reorder',
    method: 'POST',
    body,
  });
