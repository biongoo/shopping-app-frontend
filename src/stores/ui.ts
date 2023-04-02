import { Color, PaletteMode, AlertColor } from '@mui/material';
import { orange } from '@mui/material/colors';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Alert = {
  open: boolean;
  time?: number;
  bodyKey?: string;
  titleKey?: string;
  variant?: AlertColor;
};

type Ui = {
  alert: Alert;
  color: Color;
  mode: PaletteMode;
  setColor: (newColor: Color) => void;
  setMode: (newMode: PaletteMode) => void;
  hideAlert: () => void;
  showAlert: (payload: Omit<Alert, 'open'>) => void;
};

export const useUiStore = create<Ui>()(
  persist(
    (set, get) => ({
      mode: 'dark',

      color: orange,

      alert: { open: false },

      showAlert: (payload) => {
        if (!payload.bodyKey && !payload.titleKey) {
          return;
        }

        set(() => ({
          alert: {
            open: true,
            bodyKey: payload.bodyKey,
            titleKey: payload.titleKey,
            time: (payload.time ?? 6) * 1000,
            variant: payload.variant ?? 'success',
          },
        }));
      },

      hideAlert: () => {
        set((ui) => ({
          alert: {
            ...ui.alert,
            open: false,
          },
        }));
      },

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

      partialize: (state) => ({
        mode: state.mode,
        color: state.color,
      }),
    }
  )
);
