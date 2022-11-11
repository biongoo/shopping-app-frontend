import { FieldPath, FieldValues, UseFormSetError } from 'react-hook-form';
import { ApiError } from '~/models';
import { useUiStore } from '~/stores';

type Props<T extends FieldValues> = {
  fn?: (apiError?: ApiError) => void;
  setError?: UseFormSetError<T>;
};

export const generateOnError = <T extends FieldValues>(props?: Props<T>) => {
  return (apiError: ApiError) => {
    props?.fn?.(apiError);

    if (apiError.inputErrors.length > 0 && props?.setError) {
      const reversedErrors = apiError.inputErrors.reverse();

      for (const error of reversedErrors) {
        if (error.inputName) {
          props.setError(error.inputName as FieldPath<T>, {
            message: error.key,
          });
        }
      }
    }

    if (apiError.inputErrors.length > 0 && !props?.setError) {
      const firstError = apiError.inputErrors.find(() => true);

      if (firstError) {
        useUiStore.getState().showAlert({
          time: 30,
          variant: 'error',
          titleKey: 'error',
          bodyKey: firstError.key,
        });
      }
    }

    if (apiError.inputErrors.length === 0 && apiError.mainError) {
      useUiStore.getState().showAlert({
        time: 30,
        variant: 'error',
        titleKey: 'error',
        bodyKey: apiError.mainError.key,
      });
    }
  };
};
