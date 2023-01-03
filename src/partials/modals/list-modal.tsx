import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { putList } from '~/api';
import { FormModal, Input } from '~/bits';
import { QueryKey } from '~/enums';
import { List } from '~/types';
import { generateOnError, generateOnSuccess, useClearCache } from '~/utils';

type Props = {
  isOpen: boolean;
  list?: List;
  onClose: () => void;
};

type ListInputs = {
  name: string;
};

export const ListModal = (props: Props) => {
  const { list, isOpen, onClose } = props;
  const navigate = useNavigate();
  const mutation = useMutation(putList);
  const clearCache = useClearCache(QueryKey.lists);
  const { control, reset, setError, handleSubmit } = useForm<ListInputs>({
    defaultValues: {
      name: list?.name ?? '',
    },
  });

  const onSubmit = (data: ListInputs) => {
    const preparedData = {
      id: list?.id,
      name: data.name ?? undefined,
    };

    mutation.mutate(preparedData, {
      onSuccess: generateOnSuccess({
        alertTime: 5,
        message: list ? 'successfullyEdited' : 'successfullyCreated',
        reset,
        fn: ({ data }) => {
          clearCache();

          if (list) {
            onClose();
          } else {
            navigate(`${data}`);
          }
        },
      }),
      onError: generateOnError({ setError }),
    });
  };

  return (
    <FormModal
      isOpen={isOpen}
      saveKey={list ? undefined : 'create'}
      titleKey={list ? 'editList' : 'addList'}
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
