import { connectApi } from './connect-api';

export const getShops = () =>
  connectApi({
    endpoint: 'shop',
  });
