import { FieldValues, UseFormReset } from 'react-hook-form';
import { ApiData } from '~/models';
import { useUiStore } from '~/stores';

type Props<Res, Req, Inputs extends FieldValues> = {
  message?: string;
  alertTime?: number;
  fn?: (data: Res, variables: Req) => void;
  reset?: UseFormReset<Inputs>;
};

export const generateOnSuccess = <Res, Req, T extends FieldValues>(
  props?: Props<Res, Req, T>
) => {
  return (data: Res, variables: Req) => {
    if (!(data instanceof ApiData)) {
      return;
    }

    props?.fn?.(data, variables);

    if (data.message || props?.message) {
      useUiStore.getState().showAlert({
        time: props?.alertTime ?? 30,
        variant: 'success',
        titleKey: 'success',
        bodyKey: data.message ?? props?.message,
      });
    }

    setTimeout(() => props?.reset?.(), 100);
  };
};
