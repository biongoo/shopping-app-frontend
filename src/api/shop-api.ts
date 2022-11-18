import { OrderType } from '~/enums';
import { ApiData } from '~/models';
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

export const getShops = (): Promise<ApiData<Shop[]>> =>
  connectApi({
    endpoint: 'shop',
  });

export const addShop = (body: PostShopDto): Promise<ApiData<Shop>> =>
  connectApi({
    endpoint: 'shop',
    method: 'POST',
    body,
  });

export const editShop = (body: PatchShopDto): Promise<ApiData<Shop>> =>
  connectApi({
    endpoint: 'shop',
    method: 'PATCH',
    body,
  });

export const deleteShop = (body: DeleteShopDto): Promise<ApiData> =>
  connectApi({
    endpoint: 'shop',
    method: 'DELETE',
    body,
  });

export const reorderShops = (body: PostShopsOrderDto): Promise<ApiData> =>
  connectApi({
    endpoint: 'shop/reorder',
    method: 'POST',
    body,
  });
