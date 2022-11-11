import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FormModal, IconButton } from '~/bits';

export const AddShopModal = () => {
  const { t } = useTranslation();
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);

  return (
    <>
      <IconButton
        open={isOpenAddModal}
        title={t('addShop')}
        onClick={() => setIsOpenAddModal(true)}
      >
        <AddIcon />
      </IconButton>
      <FormModal
        title={t('addShop')}
        isOpen={isOpenAddModal}
        onClose={() => setIsOpenAddModal(false)}
      />
    </>
  );
};
