import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { Button, darken, lighten, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useUiStore } from '~/stores';

export const ThemeMode = () => {
  const { t } = useTranslation();
  const [mode, setMode] = useUiStore((store) => [store.mode, store.setMode]);

  const lightColor =
    mode === 'light' ? 'primary.main' : 'backgroundDefault.dark';

  const darkColor =
    mode === 'dark' ? 'primary.main' : 'backgroundDefault.light';

  return (
    <Stack spacing={1}>
      <Typography>{t('mode')}</Typography>
      <Stack direction="row" justifyContent="space-between">
        <Button
          onClick={() => setMode('light')}
          sx={{
            width: 88,
            height: 88,
            boxShadow: 4,
            bgcolor: 'backgroundDefault.light',
            '&:hover': {
              bgcolor: (theme) => lighten(theme.palette.primary.main, 0.7),
            },
          }}
        >
          <LightModeIcon sx={{ color: lightColor }} />
        </Button>
        <Button
          onClick={() => setMode('dark')}
          sx={{
            width: 88,
            height: 88,
            boxShadow: 4,
            bgcolor: 'backgroundDefault.dark',
            '&:hover': {
              bgcolor: (theme) => darken(theme.palette.primary.main, 0.6),
            },
          }}
        >
          <DarkModeIcon sx={{ color: darkColor }} />
        </Button>
      </Stack>
    </Stack>
  );
};
