import { Shop } from '~/types';
import { connectApi } from './connect-api';

type PostShopDto = {
  name: string;
};

type PatchShopDto = {
  shopId: number;
  name: string;
};

type DeleteShopDto = {
  shopId: number;
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
