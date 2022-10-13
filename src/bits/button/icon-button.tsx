import { Box, IconButton as IconButtonMui, Tooltip } from '@mui/material';
import { MouseEventHandler, PropsWithChildren } from 'react';

type Props = PropsWithChildren & {
  title: string;
  open: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

export const IconButton = (props: Props) => (
  <Tooltip title={props.title} arrow>
    <IconButtonMui
      color="primary"
      onClick={props.onClick}
      sx={{
        padding: 0,
        width: 44,
        height: 44,
      }}
    >
      <Box
        color={props.open ? 'primary.main' : 'icon.primary'}
        sx={{ display: 'flex' }}
      >
        {props.children}
      </Box>
    </IconButtonMui>
  </Tooltip>
);
