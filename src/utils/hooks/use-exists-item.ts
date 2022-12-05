import { useEffect, useState } from 'react';

type Data = { id: number }[];
type UpdateFn = (id: number) => void;

export const useExistsItem = (data: Data, updateFn: UpdateFn) => {
  const [idToUpdate, setIdToUpdate] = useState<number>();

  useEffect(() => {
    if (idToUpdate !== undefined && data.some((x) => x.id === idToUpdate)) {
      updateFn(idToUpdate);
      setIdToUpdate(undefined);
    }
  }, [data, idToUpdate]);

  return [idToUpdate, setIdToUpdate] as const;
};
