import { OrderType } from '~/enums';
import { ApiData } from '~/models';
import { Section, Shop } from '~/types';
import { connectApi } from './connect-api';

export type PostSectionDto = {
  name: string;
  shopId: number;
  orderType: OrderType;
  orderAfterId?: number;
};

type GetSectionDto = {
  shopId: number;
};

type PatchSectionDto = {
  id: number;
  name: string;
  shopId: number;
  orderType: OrderType;
  orderAfterId?: number;
};

type DeleteSectionDto = {
  id: number;
  shopId: number;
};

type PostSectionsOrderDto = {
  shopId: number;
  sections: Array<{
    id: number;
    order: number;
  }>;
};

type SectionWithShop = {
  shop: Shop;
  sections: Section[];
};

export const getSections = (body: GetSectionDto): Promise<ApiData<Section[]>> =>
  connectApi({
    endpoint: `shop/section?shopId=${body.shopId}&withShop=false`,
  });

export const getSectionsWithShop = (
  body: GetSectionDto
): Promise<ApiData<SectionWithShop>> =>
  connectApi({
    endpoint: `shop/section?shopId=${body.shopId}&withShop=true`,
  });

export const addSection = (body: PostSectionDto): Promise<ApiData<Section>> =>
  connectApi({
    endpoint: 'shop/section',
    method: 'POST',
    body,
  });

export const editSection = (body: PatchSectionDto): Promise<ApiData<Section>> =>
  connectApi({
    endpoint: 'shop/section',
    method: 'PATCH',
    body,
  });

export const deleteSection = (body: DeleteSectionDto): Promise<ApiData> =>
  connectApi({
    endpoint: 'shop/section',
    method: 'DELETE',
    body,
  });

export const reorderSections = (body: PostSectionsOrderDto): Promise<ApiData> =>
  connectApi({
    endpoint: 'shop/section/reorder',
    method: 'POST',
    body,
  });
