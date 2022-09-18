import {
  createTheme,
  CssBaseline,
  PaletteMode,
  ThemeProvider,
} from '@mui/material';
import { amber, deepOrange } from '@mui/material/colors';
import React, { ReactNode } from 'react';

type Properties = {
  children: ReactNode;
};

const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          // light mode
          primary: amber,
        }
      : {
          // dark mode
          primary: deepOrange,
          background: {
            default: '#161c24',
            paper: '#161c24',
          },
        }),
  },
});

export const Theme = ({ children }: Properties) => {
  const mode = 'dark';
  const theme = React.useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};
