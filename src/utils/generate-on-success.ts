import { FieldValues, UseFormReset } from 'react-hook-form';
import { ApiData } from '~/models';
import { useUiStore } from '~/stores';

type Props<Res, Inputs extends FieldValues> = {
  fn?: (data?: ApiData<Res>) => void;
  reset?: UseFormReset<Inputs>;
};

export const generateOnSuccess = <Res, T extends FieldValues>(
  props?: Props<Res, T>
) => {
  return (data: ApiData<Res>) => {
    props?.fn?.(data);
    props?.reset?.();

    if (data.message) {
      useUiStore.getState().showAlert({
        time: 30,
        variant: 'success',
        titleKey: 'success',
        bodyKey: data.message,
      });
    }
  };
};
