import { useQueryClient } from '@tanstack/react-query';
import { QueryKey } from '~/enums';

export const useClearCache = (key: QueryKey) => {
  const queryClient = useQueryClient();

  switch (key) {
    case QueryKey.shops: {
      return () => {
        queryClient.invalidateQueries({
          queryKey: [QueryKey.shops],
        });
        queryClient.invalidateQueries({
          queryKey: [QueryKey.sections],
        });
        queryClient.invalidateQueries({
          queryKey: [QueryKey.sectionProducts],
        });
        queryClient.invalidateQueries({
          queryKey: [QueryKey.products],
        });
        queryClient.invalidateQueries({
          queryKey: [QueryKey.lists],
        });
      };
    }
    case QueryKey.sections: {
      return () => {
        queryClient.invalidateQueries({
          queryKey: [QueryKey.sections],
        });
        queryClient.invalidateQueries({
          queryKey: [QueryKey.sectionProducts],
        });
        queryClient.invalidateQueries({
          queryKey: [QueryKey.products],
        });
        queryClient.invalidateQueries({
          queryKey: [QueryKey.lists],
        });
      };
    }
    case QueryKey.products:
    case QueryKey.sectionProducts: {
      return () => {
        queryClient.invalidateQueries({
          queryKey: [QueryKey.sectionProducts],
        });
        queryClient.invalidateQueries({
          queryKey: [QueryKey.products],
        });
        queryClient.invalidateQueries({
          queryKey: [QueryKey.lists],
        });
      };
    }
    case QueryKey.lists: {
      return () => {
        queryClient.invalidateQueries({
          queryKey: [QueryKey.lists],
        });
      };
    }
    default: {
      return () => {
        queryClient.invalidateQueries();
      };
    }
  }
};
