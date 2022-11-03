import { FieldPath, FieldValues, UseFormSetError } from 'react-hook-form';
import { ApiError } from '~/models';
import { useUiStore } from '~/stores';

export const generateOnError = <Inputs extends FieldValues>(
  setError: UseFormSetError<Inputs>
) => {
  return (apiError: ApiError) => {
    for (const error of apiError.inputErrors) {
      if (error.inputName) {
        setError(error.inputName as FieldPath<Inputs>, {
          message: error.key,
        });
      }
    }

    if (apiError.mainError) {
      useUiStore.getState().showAlert({
        time: 60,
        variant: 'error',
        titleKey: 'error',
        bodyKey: apiError.mainError.key,
      });
    }
  };
};
