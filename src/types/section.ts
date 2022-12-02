import { OrderType } from '~/enums';

export type Section = {
  id: number;
  name: string;
  shopId: number;
  order: number;
  orderType?: OrderType;
  orderAfterId?: number;
};
