import { Typography } from '@mui/material';
import { ComponentProps } from 'react';
import { useTranslation } from 'react-i18next';

type Props = Omit<ComponentProps<typeof Typography>, 'children'> & {
  textKey: string;
  options?: Record<string, string>;
};

export const TranslatedText = ({ textKey, options, ...props }: Props) => {
  const { t } = useTranslation();

  return <Typography {...props}>{t(textKey, options ?? {})}</Typography>;
};
