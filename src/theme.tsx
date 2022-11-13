import {
  Color,
  createTheme,
  CssBaseline,
  PaletteMode,
  ThemeOptions,
  ThemeProvider,
} from '@mui/material';
import { ReactNode } from 'react';
import { useUiStore } from '~/stores';
import { Alert } from './partials';

type Properties = {
  children: ReactNode;
};

const getDesignTokens = (mode: PaletteMode, color: Color): ThemeOptions => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          // light mode
          text: {
            primary: '#2a343d',
          },
          icon: {
            primary: '#6d7b87',
          },
          background: {
            default: '#f0f6fa',
            paper: '#f0f6fa',
          },
          action: {
            selectedOpacity: 0.25,
            hoverOpacity: 0.15,
          },
          backgroundDefault: {
            light: '#f0f6fa',
            dark: '#161c24',
          },
          primary: color,
        }
      : {
          // dark mode
          text: {
            primary: '#edf0f2',
          },
          icon: {
            primary: '#8b959e',
          },
          background: {
            default: '#161c24',
            paper: '#212b36',
          },
          backgroundDefault: {
            light: '#f0f6fa',
            dark: '#161c24',
          },
          action: {
            selectedOpacity: 0.25,
            hoverOpacity: 0.15,
          },
          primary: color,
        }),
  },
  shape: {
    borderRadius: 5,
  },
});

export const Theme = ({ children }: Properties) => {
  const mode = useUiStore((store) => store.mode);
  const color = useUiStore((store) => store.color);

  const theme = createTheme(getDesignTokens(mode, color));

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
      <Alert />
    </ThemeProvider>
  );
};
