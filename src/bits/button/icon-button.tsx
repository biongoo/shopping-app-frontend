import { Box, IconButton as IconButtonMui, Tooltip } from '@mui/material';
import { MouseEventHandler, PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';

type Props = PropsWithChildren & {
  open: boolean;
  titleKey: string;
  scale?: number;
  color?: string;
  disabled?: boolean;
  placement?: 'left' | 'right';
  edge?: false | 'end' | 'start';
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

export const IconButton = (props: Props) => {
  const { t } = useTranslation();

  const size = props.scale ? props.scale * 44 : 44;

  return (
    <Tooltip title={t(props.titleKey)} arrow placement={props.placement}>
      <IconButtonMui
        edge={props.edge}
        onClick={props.onClick}
        disabled={props.disabled}
        sx={{
          padding: 0,
          width: size,
          height: size,
        }}
      >
        <Box
          color={props.color ?? (props.open ? 'primary.main' : 'icon.primary')}
          sx={{ display: 'flex' }}
        >
          {props.children}
        </Box>
      </IconButtonMui>
    </Tooltip>
  );
};
