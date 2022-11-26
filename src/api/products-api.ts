import { ApiData } from '~/models';
import { Product } from '~/types';
import { connectApi } from './connect-api';

export const getProducts = (): Promise<ApiData<Product[]>> =>
  connectApi({
    endpoint: 'product',
  });
