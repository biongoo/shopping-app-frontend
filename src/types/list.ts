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

type ListItem = {
  id: number;
  unit: Unit;
  name: string;
  count: number;
  checked: boolean;
  productId: number;
};
