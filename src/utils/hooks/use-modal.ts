import { useState } from 'react';

type Modal<T> = {
  isOpen: boolean;
  data?: T;
};

export const useModal = <T>() => {
  const [state, setState] = useState<Modal<T>>({ isOpen: false });

  const setOpen = (data: T) => {
    setState({ isOpen: true, data });
  };

  const setClose = () => {
    setState((x) => ({ isOpen: false, data: x.data }));
  };

  return [state, setOpen, setClose] as const;
};
