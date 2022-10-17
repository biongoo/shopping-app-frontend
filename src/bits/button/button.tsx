import ButtonMui from '@mui/material/Button';
import { ComponentProps } from 'react';

type Props = Pick<
  ComponentProps<typeof ButtonMui>,
  'onClick' | 'variant' | 'color' | 'type'
> & {
  text: string;
};

export const Button = (props: Props) => {
  return (
    <ButtonMui
      type={props.type}
      variant={props.variant ?? 'outlined'}
      color={props.color ?? 'primary'}
      onMouseDown={props.onClick}
    >
      {props.text}
    </ButtonMui>
  );
};
