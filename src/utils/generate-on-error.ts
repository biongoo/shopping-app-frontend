import { FieldPath, FieldValues, UseFormSetError } from 'react-hook-form';
import { ApiError } from '~/models';
import { useUiStore } from '~/stores';

type Props<Req, T extends FieldValues> = {
  fn?: (error: ApiError, variables?: Req) => void;
  setError?: UseFormSetError<T>;
};

export const generateOnError = <Req, T extends FieldValues>(
  props?: Props<Req, T>
) => {
  return (error: unknown, variables?: Req) => {
    if (!(error instanceof ApiError)) {
      return;
    }

    props?.fn?.(error, variables);

    if (error.inputErrors.length > 0 && props?.setError) {
      const reversedErrors = error.inputErrors.reverse();

      for (const singleError of reversedErrors) {
        if (singleError.inputName) {
          props.setError(singleError.inputName as FieldPath<T>, {
            message: singleError.key,
          });
        }
      }
    }

    if (error.inputErrors.length > 0 && !props?.setError) {
      const firstError = error.inputErrors.find(() => true);

      if (firstError) {
        useUiStore.getState().showAlert({
          time: 30,
          variant: 'error',
          titleKey: 'error',
          bodyKey: firstError.key,
        });
      }
    }

    if (error.inputErrors.length === 0 && error.mainError) {
      useUiStore.getState().showAlert({
        time: 30,
        variant: 'error',
        titleKey: 'error',
        bodyKey: error.mainError.key,
      });
    }
  };
};
