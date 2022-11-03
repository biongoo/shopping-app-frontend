import LoadingButton from '@mui/lab/LoadingButton';
import { ComponentProps } from 'react';

type Props = Pick<
  ComponentProps<typeof LoadingButton>,
  'onClick' | 'variant' | 'color' | 'type' | 'loading'
> & {
  text: string;
};

export const Button = (props: Props) => {
  return (
    <LoadingButton
      type={props.type}
      variant={props.variant ?? 'outlined'}
      color={props.color ?? 'primary'}
      onMouseDown={props.onClick}
      loading={props.loading}
    >
      {props.text}
    </LoadingButton>
  );
};
