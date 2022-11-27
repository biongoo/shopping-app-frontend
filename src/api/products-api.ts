import { Unit } from '~/enums';
import i18n from '~/i18n';
import { ApiData } from '~/models';
import { Product } from '~/types';
import { connectApi } from './connect-api';

type PostProductDto = {
  name: string;
  units: Unit[];
  sectionId?: number;
};

export const getProducts = (): Promise<ApiData<Product[]>> =>
  connectApi({
    endpoint: `product?lang=${i18n.resolvedLanguage}`,
  });

export const addProduct = (body: PostProductDto): Promise<ApiData<Product>> =>
  connectApi({
    endpoint: 'product',
    method: 'POST',
    body: {
      ...body,
      lang: i18n.resolvedLanguage,
    },
  });
