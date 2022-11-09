import { FieldValues, UseFormReset } from 'react-hook-form';
import { ApiData } from '~/models';
import { useUiStore } from '~/stores';

type Props<Res, Inputs extends FieldValues> = {
  message?: string;
  fn?: (data: ApiData<Res>, variables: Inputs) => void;
  reset?: UseFormReset<Inputs>;
};

export const generateOnSuccess = <Res, T extends FieldValues>(
  props?: Props<Res, T>
) => {
  return (data: ApiData<Res>, variables: T) => {
    props?.fn?.(data, variables);
    props?.reset?.();

    if (data.message || props?.message) {
      useUiStore.getState().showAlert({
        time: 30,
        variant: 'success',
        titleKey: 'success',
        bodyKey: data.message ?? props?.message,
      });
    }
  };
};
