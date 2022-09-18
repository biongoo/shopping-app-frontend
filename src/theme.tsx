import { ReactNode } from 'react';
import { CssBaseline } from '@mui/material';

type Properties = {
  children: ReactNode;
};

export const Theme = ({ children }: Properties) => {
  return (
    <>
      <CssBaseline />
      {children}
    </>
  );
};
