import { Shop } from '~/types';
import { connectApi } from './connect-api';

export const getShops = () =>
  connectApi<never, Shop[]>({
    endpoint: 'shop',
  });
