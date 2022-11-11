import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

type Props = {
  title: 'string';
  isOpen: boolean;
  onClose: () => void;
};

export const FormModal = (props: Props) => {
  const { t } = useTranslation();
  return (
    <Dialog
      open={props.isOpen}
      onClose={props.onClose}
      PaperProps={{
        sx: {
          width: '100%',
          m: { xs: 2, sm: 4 },
        },
      }}
    >
      <DialogTitle>{t(props.title)}</DialogTitle>
      <DialogContent dividers={true}>test</DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>Cancel</Button>
        <Button onClick={props.onClose}>Subscribe</Button>
      </DialogActions>
    </Dialog>
  );
};
