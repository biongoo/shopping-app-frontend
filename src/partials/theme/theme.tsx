import PaletteIcon from '@mui/icons-material/Palette';
import { useState } from 'react';
import { IconButton } from '~/bits';
import { ThemeDrawer } from './components';

export const Theme = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleIsOpen = () => {
    setIsOpen((x) => !x);
  };

  return (
    <>
      <IconButton titleKey="themeSettings" open={isOpen} onClick={toggleIsOpen}>
        <PaletteIcon />
      </IconButton>
      <ThemeDrawer isOpen={isOpen} onClose={toggleIsOpen} />
    </>
  );
};
