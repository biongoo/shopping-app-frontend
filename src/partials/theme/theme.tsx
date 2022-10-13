import PaletteIcon from '@mui/icons-material/Palette';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IconButton } from '~/bits';
import { ThemeDrawer } from './components';

export const Theme = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleIsOpen = () => {
    setIsOpen((x) => !x);
  };

  return (
    <>
      <IconButton
        title={t('themeSettings')}
        open={isOpen}
        onClick={toggleIsOpen}
      >
        <PaletteIcon />
      </IconButton>
      <ThemeDrawer isOpen={isOpen} onClose={toggleIsOpen} />
    </>
  );
};
