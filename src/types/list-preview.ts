import { Unit } from '~/enums';

export type ListPreview = {
  id: number;
  name: string;
  updatedAt: string;
  items: ListItemPreview[];
};

export type ListItemPreview = {
  unit: Unit;
  count: number;
  checked: boolean;
  product: ProductPreview;
};

type ProductPreview = {
  id: number;
  name: string;
};
