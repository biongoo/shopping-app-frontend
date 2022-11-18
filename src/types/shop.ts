import { OrderType } from '~/enums';

export type Shop = {
  id: number;
  name: string;
  orderNumber: number;
  orderType?: OrderType;
  orderAfterId?: number;
};
