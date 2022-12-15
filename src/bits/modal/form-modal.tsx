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
  saveKey?: string;
  reset: () => void;
  onClose: () => void;
  handleSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
};

export const FormModal = (props: Props) => {
  const { t } = useTranslation();

  const handleClose = () => {
    props.onClose();

    setTimeout(() => {
      props.reset();
    }, 100);
  };

  return (
    <Dialog
      open={props.isOpen}
      onClose={handleClose}
      PaperProps={{
        sx: {
          width: '100%',
          m: { xs: 2, sm: 4 },
          backgroundImage: 'none',
        },
      }}
    >
      <form noValidate autoComplete="off" onSubmit={props.handleSubmit}>
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
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
        </Stack>
        <DialogContent dividers={true}>{props.children}</DialogContent>
        <DialogActions sx={{ pr: 2 }}>
          <Button
            type="submit"
            textKey={props.saveKey ?? 'save'}
            color="success"
            loading={props.isLoading}
          />
        </DialogActions>
      </form>
    </Dialog>
  );
};
