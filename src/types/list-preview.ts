export type ListPreview = {
  id: number;
  name: string;
  updatedAt: string;
  items: ListItemPreview[];
};

export type ListItemPreview = {
  checked: boolean;
  product: ProductPreview;
};

type ProductPreview = {
  id: number;
  name: string;
};
