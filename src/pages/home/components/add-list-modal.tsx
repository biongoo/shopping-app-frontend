import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { addList } from '~/api';
import { FormModal, Input } from '~/bits';
import { generateOnError, generateOnSuccess } from '~/utils';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

type ListInputs = {
  name: string;
};

export const AddListModal = (props: Props) => {
  const { isOpen, onClose } = props;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const mutation = useMutation(addList);
  const { control, reset, setError, handleSubmit } = useForm<ListInputs>({
    defaultValues: {
      name: '',
    },
  });

  const onSubmit = (data: ListInputs) => {
    const preparedData = {
      name: data.name ?? undefined,
    };

    mutation.mutate(preparedData, {
      onSuccess: generateOnSuccess({
        alertTime: 5,
        message: 'successfullyCreated',
        reset,
        fn: ({ data }) => {
          queryClient.invalidateQueries({ queryKey: ['lists'] });
          navigate(`${data}`);
        },
      }),
      onError: generateOnError({ setError }),
    });
  };

  return (
    <FormModal
      isOpen={isOpen}
      saveKey="create"
      titleKey="addList"
      isLoading={mutation.isLoading}
      reset={reset}
      onClose={onClose}
      handleSubmit={handleSubmit(onSubmit)}
    >
      <Input
        name="name"
        labelKey="nameOptional"
        control={control}
        fullWidth
        rules={{ required: false }}
      />
    </FormModal>
  );
};
