import {
  createTheme,
  CssBaseline,
  PaletteMode,
  ThemeOptions,
  ThemeProvider,
} from '@mui/material';
import { amber, orange } from '@mui/material/colors';
import { ReactNode } from 'react';
import { useUiStore } from '~/stores';

type Properties = {
  children: ReactNode;
};

const getDesignTokens = (mode: PaletteMode): ThemeOptions => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          // light mode
          primary: amber,
        }
      : {
          // dark mode
          primary: orange,
          background: {
            default: '#161c24',
            paper: '#212b36',
          },
        }),
  },
  shape: {
    borderRadius: 8,
  },
});

export const Theme = ({ children }: Properties) => {
  const mode = useUiStore((store) => store.mode);
  const theme = createTheme(getDesignTokens(mode));

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};
