import { Stack } from '@mui/material';
import {
  amber,
  blue,
  brown,
  cyan,
  deepOrange,
  deepPurple,
  green,
  indigo,
  lightGreen,
  lime,
  orange,
  pink,
  purple,
  red,
  teal,
} from '@mui/material/colors';
import { TranslatedText } from '~/bits';
import { useUiStore } from '~/stores';
import { ThemeColorRow } from './theme-color-row';

const colors = [
  red,
  pink,
  purple,
  deepPurple,
  indigo,
  blue,
  cyan,
  teal,
  green,
  lightGreen,
  lime,
  amber,
  orange,
  deepOrange,
  brown,
];

export const ThemeColor = () => {
  const [paletteColor, setColor] = useUiStore((store) => [
    store.color,
    store.setColor,
  ]);

  const rows: JSX.Element[] = [];

  for (let i = 0; i < colors.length; i += 3) {
    rows.push(
      <Stack spacing={1} direction="row" key={`row-${i}`}>
        <ThemeColorRow
          index={i}
          colors={colors}
          activeColor={paletteColor}
          setColor={setColor}
        />
      </Stack>
    );
  }

  return (
    <Stack spacing={1}>
      <TranslatedText textKey="color" />
      {rows}
    </Stack>
  );
};
