export type Data = Record<string, string | number> & {
  id: number;
  name: string;
  orderNumber: number;
};

export type HeadCell = {
  labelKey: keyof Data;
  isOrdering: boolean;
};

export type Order = 'asc' | 'desc';
