import { Box, IconButton as IconButtonMui, Tooltip } from '@mui/material';
import { MouseEventHandler, PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';

type Props = PropsWithChildren & {
  open: boolean;
  titleKey: string;
  scale?: number;
  color?: string;
  edge?: false | 'end' | 'start';
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

export const IconButton = (props: Props) => {
  const { t } = useTranslation();

  const size = props.scale ? props.scale * 44 : 44;

  return (
    <Tooltip title={t(props.titleKey)} arrow>
      <IconButtonMui
        onClick={props.onClick}
        edge={props.edge}
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
