import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { shareList } from '~/api';
import { FormModal, Input } from '~/bits';
import { List } from '~/types';
import { generateOnError, generateOnSuccess } from '~/utils';

type Props = {
  list: List;
  isOpen: boolean;
  onClose: () => void;
};

type ListInputs = {
  email: string;
};

export const ShareListModal = (props: Props) => {
  const { list, isOpen, onClose } = props;
  const mutation = useMutation({ mutationFn: shareList });
  const { control, reset, setError, handleSubmit } = useForm<ListInputs>({
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = (data: ListInputs) => {
    const preparedData = {
      id: list.id,
      email: data.email,
    };

    mutation.mutate(preparedData, {
      onSuccess: generateOnSuccess({
        alertTime: 5,
        message: 'successfullyAdded',
        reset,
        fn: onClose,
      }),
      onError: generateOnError({ setError }),
    });
  };

  return (
    <FormModal
      isOpen={isOpen}
      titleKey="shareList"
      isLoading={mutation.isPending}
      reset={reset}
      onClose={onClose}
      handleSubmit={handleSubmit(onSubmit)}
    >
      <Input
        fullWidth
        name="email"
        labelKey="email"
        control={control}
        patternErrorMessage="invalidEmail"
        rules={{
          pattern:
            // eslint-disable-next-line unicorn/better-regex
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        }}
      />
    </FormModal>
  );
};
