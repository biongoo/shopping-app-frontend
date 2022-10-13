import { Color, PaletteMode } from '@mui/material';
import { orange } from '@mui/material/colors';
import create from 'zustand';
import { persist } from 'zustand/middleware';

type Ui = {
  color: Color;
  mode: PaletteMode;
  setColor: (newColor: Color) => void;
  setMode: (newMode: PaletteMode) => void;
};

export const useUiStore = create<Ui>()(
  persist(
    (set, get) => ({
      mode: 'dark',
      color: orange,
      setMode: (newMode) => {
        if (newMode === get().mode) {
          return;
        }

        set(() => ({ mode: newMode }));
      },
      setColor: (newColor) => {
        if (newColor === get().color) {
          return;
        }

        set(() => ({ color: newColor }));
      },
    }),
    {
      name: 'ui',
      partialize: (state) => ({ mode: state.mode, color: state.color }),
    }
  )
);
