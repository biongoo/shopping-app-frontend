import { Unit } from '~/enums';

export type ListPreview = {
  id: number;
  name: string;
  updatedAt: string;
  items: ListItemPreview[];
  ownerEmail?: string;
};

export type ListItemPreview = {
  id: number;
  unit: Unit;
  name: string;
  count: number;
  checked: boolean;
};
