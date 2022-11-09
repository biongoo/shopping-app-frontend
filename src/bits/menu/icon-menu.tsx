import { Menu } from '@mui/material';
import { ComponentProps, ReactElement, useState } from 'react';
import { IconButton } from '../button/icon-button';

type Props = {
  iconProps: Omit<ComponentProps<typeof IconButton>, 'open'>;
  content: (props: { onClose: () => void }) => ReactElement | null;
};

export const IconMenu = (props: Props) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isOpen = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton {...props.iconProps} onClick={handleClick} open={isOpen} />
      <Menu
        open={isOpen}
        anchorEl={anchorEl}
        onClose={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 10px rgba(0,0,0,0.36))',
            mt: 1.5,
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 17,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <props.content onClose={handleClose} />
      </Menu>
    </>
  );
};
