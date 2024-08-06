import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { deleteList } from '~/api';
import { AlertModal, TranslatedText } from '~/bits';
import { QueryKey } from '~/enums';
import { ApiData } from '~/models';
import { List, ListPreview } from '~/types';
import { generateOnError, generateOnSuccess, useClearCache } from '~/utils';

type Props = {
  isOpen: boolean;
  list: List;
  onClose: () => void;
};

export const DeleteListModal = (props: Props) => {
  const { list, isOpen, onClose } = props;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const clearCache = useClearCache(QueryKey.lists);

  const mutation = useMutation({
    mutationFn: deleteList,
    onMutate: async (req) => {
      await queryClient.cancelQueries({
        queryKey: [QueryKey.lists, req.id],
      });

      queryClient.setQueryData<ApiData<ListPreview[]>>(
        [QueryKey.lists],
        (old) => {
          if (!old) {
            return old;
          }

          return new ApiData(
            old.status,
            old.data.filter((x) => x.id !== req.id),
            old.message
          );
        }
      );

      navigate('/app/home', { replace: true });
    },
    onError: generateOnError(),
    onSuccess: generateOnSuccess({
      alertTime: 5,
      message: 'successfullyDeleted',
      fn: clearCache,
    }),
  });

  const handleSubmit = () => {
    const data = { id: list.id };
    mutation.mutate(data);
  };

  return (
    <AlertModal
      titleKey="deleteList"
      isOpen={isOpen}
      isLoading={mutation.isPending}
      onClose={onClose}
      onOk={handleSubmit}
    >
      <TranslatedText
        textKey="areYouSureDelete"
        options={{ item: list.name }}
      />
    </AlertModal>
  );
};
