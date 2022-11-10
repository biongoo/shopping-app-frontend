import { useQuery } from '@tanstack/react-query';
import { getShops } from '~/api';

export const ShopPage = () => {
  const { isInitialLoading } = useQuery({
    queryKey: ['shops'],
    queryFn: getShops,
  });

  return <div>ShopPage</div>;
};
