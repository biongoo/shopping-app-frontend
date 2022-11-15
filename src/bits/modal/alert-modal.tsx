import CloseIcon from '@mui/icons-material/Close';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from '@mui/material';
import { PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, IconButton } from '../button';

type Props = PropsWithChildren & {
  isOpen: boolean;
  titleKey: string;
  isLoading: boolean;
  onOk: () => void;
  onClose: () => void;
};

export const AlertModal = (props: Props) => {
  const { t } = useTranslation();

  return (
    <Dialog open={props.isOpen} onClose={props.onClose}>
      <Stack
        component={DialogTitle}
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        pr={1}
        py={1}
      >
        {t(props.titleKey)}
        <IconButton
          open={false}
          color="inherit"
          titleKey="close"
          onClick={props.onClose}
        >
          <CloseIcon />
        </IconButton>
      </Stack>
      <DialogContent dividers={true}>{props.children}</DialogContent>
      <DialogActions sx={{ pr: 2 }}>
        <Button
          textKey="yes"
          color="warning"
          loading={props.isLoading}
          onClick={props.onOk}
        />
      </DialogActions>
    </Dialog>
  );
};
