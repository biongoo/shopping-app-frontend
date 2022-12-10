export type ListPreview = {
  id: number;
  name: string;
  editDate: Date;
  products: ProductPreview[];
};

export type ProductPreview = {
  name: string;
  checked: boolean;
};
