import { OrderType, ProductType, Unit } from '~/enums';

export type Product = {
  id: number;
  name: string;
  type: ProductType;
  units: Unit[];
  order?: number;
  shopId?: number;
  sectionId?: number;
  orderType?: OrderType;
  orderAfterId?: number;
};
