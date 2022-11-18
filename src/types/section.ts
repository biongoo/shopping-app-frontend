import { OrderType } from '~/enums';

export type Section = {
  id: number;
  name: string;
  shopId: number;
  orderNumber: number;
  orderType?: OrderType;
  orderAfterId?: number;
};
