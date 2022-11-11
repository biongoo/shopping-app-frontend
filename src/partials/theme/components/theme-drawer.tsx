import { Divider, Drawer, Stack } from '@mui/material';
import { TranslatedText } from '~/bits';
import { ThemeColor } from './theme-color';
import { ThemeMode } from './theme-mode';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export const ThemeDrawer = (props: Props) => (
  <Drawer
    anchor="right"
    open={props.isOpen}
    onClose={props.onClose}
    PaperProps={{
      sx: {
        height: '96vh',
        marginTop: '2vh',
        backgroundImage: 'none',
        borderTopLeftRadius: (theme) => theme.shape.borderRadius * 2.5,
        borderBottomLeftRadius: (theme) => theme.shape.borderRadius * 2.5,
      },
    }}
  >
    <TranslatedText
      variant="h6"
      align="center"
      padding={2}
      textKey="themeSettings"
    />
    <Divider />
    <Stack padding={2} spacing={3}>
      <ThemeMode />
      <ThemeColor />
    </Stack>
  </Drawer>
);
