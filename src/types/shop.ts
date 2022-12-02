import { OrderType } from '~/enums';

export type Shop = {
  id: number;
  name: string;
  order: number;
  orderType?: OrderType;
  orderAfterId?: number;
};
