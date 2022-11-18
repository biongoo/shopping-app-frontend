import { OrderType } from '~/enums';
import { Shop } from '~/types';
import { connectApi } from './connect-api';

type PostShopDto = {
  name: string;
  orderType: OrderType;
  orderAfterId?: number;
};

type PatchShopDto = {
  name: string;
  orderType: OrderType;
  orderAfterId?: number;
  shopId: number;
};

type DeleteShopDto = {
  shopId: number;
};

type PostShopsOrderDto = {
  shops: Array<{
    id: number;
    orderNumber: number;
  }>;
};

export const getShops = () =>
  connectApi<Shop[]>({
    endpoint: 'shop',
  });

export const addShop = (body: PostShopDto) =>
  connectApi<Shop>({
    endpoint: 'shop',
    method: 'POST',
    body,
  });

export const editShop = (body: PatchShopDto) =>
  connectApi<Shop, PatchShopDto>({
    endpoint: 'shop',
    method: 'PATCH',
    body,
  });

export const deleteShop = (body: DeleteShopDto) =>
  connectApi({
    endpoint: 'shop',
    method: 'DELETE',
    body,
  });

export const reorderShops = (body: PostShopsOrderDto) =>
  connectApi({
    endpoint: 'shop/reorder',
    method: 'POST',
    body,
  });
