import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { alpha, Button, Color } from '@mui/material';

type Props = {
  index: number;
  colors: Color[];
  activeColor: Color;
  setColor: (color: Color) => void;
};

const ThemeColorButton = (props: Props) => {
  const color = props.colors[props.index];
  const isActive = color[500] === props.activeColor[500];

  return (
    <Button
      variant="outlined"
      onClick={() => props.setColor(color)}
      sx={{
        color: color[500],
        minWidth: 60,
        borderColor: isActive ? color[500] : 'icon.primary',
        backgroundColor: isActive ? alpha(color[500], 0.15) : 'none',
        '&:hover': {
          borderColor: color[500],
          backgroundColor: alpha(color[500], 0.3),
        },
      }}
    >
      <FiberManualRecordIcon
        sx={{
          width: 28,
          height: 28,
        }}
      />
    </Button>
  );
};

export const ThemeColorRow = (props: Props) => {
  const items: JSX.Element[] = [];

  for (let i = 0; i < 3 && props.index + i < props.colors.length; i++) {
    items.push(
      <ThemeColorButton
        key={`item-${props.index + i}`}
        colors={props.colors}
        index={props.index + i}
        activeColor={props.activeColor}
        setColor={props.setColor}
      />
    );
  }

  return <>{items}</>;
};
