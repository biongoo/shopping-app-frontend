export type Order = 'asc' | 'desc';

export type Data<T> = T & {
  id: number;
  name: string;
};

export type Column<T> = {
  width: number;
  labelKey: string;
  isOrdering: boolean;
  dataKey: keyof Data<T> | 'actions';
  py?: number;
  align?: 'right' | 'left';
  render: (item: Data<T>, index: number, isReordering: boolean) => JSX.Element;
};
