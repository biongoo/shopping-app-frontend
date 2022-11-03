import { FieldValues, UseFormReset } from 'react-hook-form';
import { useUiStore } from '~/stores';

export const generateOnSuccess = <Inputs extends FieldValues>(
  bodyKey: string,
  reset: UseFormReset<Inputs>
) => {
  return () => {
    reset();
    useUiStore.getState().showAlert({
      time: 60,
      variant: 'success',
      titleKey: 'success',
      bodyKey,
    });
  };
};
