import { Unit } from '~/enums';

export type List = {
  id: number;
  name: string;
  updatedAt: string;
  shops: ListShop[];
};

type ListShop = {
  id: number;
  name: string;
  sections: ListSection[];
};

type ListSection = {
  id: number;
  name: string;
  items: ListItem[];
};

export type ListItem = {
  id: number;
  unit: Unit;
  name: string;
  count: number;
  shopId: number;
  checked: boolean;
  productId: number;
  sectionId: number;
  description?: string;
};
