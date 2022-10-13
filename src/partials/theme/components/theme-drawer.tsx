import { Divider, Drawer, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ThemeMode } from './theme-mode';
import { ThemeColor } from './theme-color';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export const ThemeDrawer = (props: Props) => {
  const { t } = useTranslation();

  return (
    <Drawer
      anchor="right"
      open={props.isOpen}
      onClose={props.onClose}
      PaperProps={{
        sx: {
          height: '96vh',
          marginTop: '2vh',
          backgroundImage: 'none',
          borderTopLeftRadius: (theme) => theme.shape.borderRadius * 4,
          borderBottomLeftRadius: (theme) => theme.shape.borderRadius * 4,
        },
      }}
    >
      <Typography variant="h6" align="center" padding={2}>
        {t('themeSettings')}
      </Typography>
      <Divider />
      <Stack padding={2} spacing={3}>
        <ThemeMode />
        <ThemeColor />
      </Stack>
    </Drawer>
  );
};
