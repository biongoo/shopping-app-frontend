import { ProductType, Unit } from '~/enums';

export type Product = {
  id: number;
  name: string;
  type: ProductType;
  units: Unit[];
  sectionId?: number;
};
