import create from 'zustand';
import { persist } from 'zustand/middleware';
import { PaletteMode } from '@mui/material';

type Ui = {
  mode: PaletteMode;
  toggleMode: () => void;
};

export const useUiStore = create<Ui>()(
  persist(
    (set) => ({
      mode: 'dark',
      toggleMode: () =>
        set((state) => ({ mode: state.mode === 'dark' ? 'light' : 'dark' })),
    }),
    {
      name: 'ui',
      partialize: (state) => ({ mode: state.mode }),
    }
  )
);
