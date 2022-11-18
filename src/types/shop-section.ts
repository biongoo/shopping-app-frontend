import { OrderType } from '~/enums';

export type ShopSection = {
  id: number;
  name: string;
  shopId: number;
  orderNumber: number;
  orderType?: OrderType;
  orderAfterId?: number;
};
