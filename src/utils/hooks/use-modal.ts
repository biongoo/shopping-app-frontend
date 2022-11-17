import { useEffect, useState } from 'react';

type Modal<T> = {
  isInit: boolean;
  isOpen: boolean;
  isRender: boolean;
  data?: T;
};

export const useModal = <T = never>() => {
  const [state, setState] = useState<Modal<T>>({
    isInit: true,
    isOpen: false,
    isRender: false,
  });

  useEffect(() => {
    let timeout: number;

    if (state.isOpen === false && !state.isInit) {
      timeout = setTimeout(
        () =>
          setState({
            isInit: true,
            isOpen: false,
            isRender: false,
          }),
        300
      );
    }

    return () => clearTimeout(timeout);
  }, [state.isOpen]);

  const setOpen = (data?: T) => {
    setState({
      isInit: false,
      isOpen: true,
      isRender: true,
      data,
    });
  };

  const setClose = () => {
    setState((x) => ({
      isInit: false,
      isOpen: false,
      isRender: true,
      data: x.data,
    }));
  };

  return [state, setOpen, setClose] as const;
};
