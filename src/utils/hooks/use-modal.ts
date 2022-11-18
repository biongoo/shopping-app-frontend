import { useEffect, useState } from 'react';

type Modal<T> = {
  isHide: boolean;
  isInit: boolean;
  isOpen: boolean;
  isRender: boolean;
  data?: T;
};

export const useModal = <T = never>() => {
  const [state, setState] = useState<Modal<T>>({
    isInit: true,
    isHide: false,
    isOpen: false,
    isRender: false,
  });

  useEffect(() => {
    let timeout: number;

    if (!state.isOpen && !state.isInit && !state.isHide) {
      timeout = setTimeout(
        () =>
          setState({
            isInit: true,
            isHide: false,
            isOpen: false,
            isRender: false,
          }),
        300
      );
    }

    return () => clearTimeout(timeout);
  }, [state.isOpen, state.isHide]);

  const setOpen = (data?: T) => {
    setState((x) => ({
      isOpen: true,
      isInit: false,
      isHide: false,
      isRender: true,
      data: data ?? x.data,
    }));
  };

  const setClose = () => {
    setState((x) => ({
      isHide: false,
      isInit: false,
      isOpen: false,
      isRender: true,
      data: x.data,
    }));
  };

  const setHide = () => {
    setState((x) => ({
      isHide: true,
      isInit: false,
      isOpen: false,
      isRender: true,
      data: x.data,
    }));
  };

  return [state, setOpen, setClose, setHide] as const;
};
