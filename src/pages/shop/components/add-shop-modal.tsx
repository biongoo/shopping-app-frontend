import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button, FormModal, IconButton } from '~/bits';

type AddShopInputs = {
  name: string;
};

export const AddShopModal = () => {
  const { t } = useTranslation();
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const { control, handleSubmit, reset, setError } = useForm<AddShopInputs>();

  return (
    <>
      <IconButton
        open={isOpenAddModal}
        titleKey="addShop"
        onClick={() => setIsOpenAddModal(true)}
      >
        <AddIcon />
      </IconButton>
      <FormModal
        titleKey="addShop"
        isOpen={isOpenAddModal}
        actions={<Button textKey="add" />}
        reset={reset}
        handleSubmit={handleSubmit(() => {
          /* */
        })}
        onClose={() => setIsOpenAddModal(false)}
      >
        xd
      </FormModal>
    </>
  );
};
