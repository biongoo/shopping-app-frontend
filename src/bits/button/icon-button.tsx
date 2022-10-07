import { IconButton as IconButtonMui, Tooltip } from '@mui/material';
import { MouseEventHandler, PropsWithChildren } from 'react';

type Props = PropsWithChildren & {
  title: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

export const IconButton = (props: Props) => {
  return (
    <Tooltip title={props.title}>
      <IconButtonMui
        onClick={props.onClick}
        sx={{
          padding: 0,
          width: 44,
          height: 44,
        }}
      >
        {props.children}
      </IconButtonMui>
    </Tooltip>
  );
};
