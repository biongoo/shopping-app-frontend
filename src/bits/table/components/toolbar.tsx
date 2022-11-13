import ReorderIcon from '@mui/icons-material/Reorder';
import SearchIcon from '@mui/icons-material/Search';
import {
  CircularProgress,
  InputAdornment,
  Stack,
  TextField,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { IconButton } from '../../button';
import CheckIcon from '@mui/icons-material/Check';

type Props = {
  search: string;
  isReordering: boolean;
  isFetchingReorder: boolean;
  onRequestReorder: () => void;
  onRequestSearch: (value: string) => void;
};

export const Toolbar = (props: Props) => {
  const { t } = useTranslation();

  let icon = <ReorderIcon />;

  if (props.isFetchingReorder) {
    icon = <CircularProgress sx={{ p: 1 }} />;
  } else if (props.isReordering) {
    icon = <CheckIcon />;
  }

  return (
    <Stack
      p={3}
      pr={1}
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      spacing={2}
    >
      <TextField
        value={props.search}
        placeholder={t('search')}
        disabled={props.isReordering}
        onChange={(e) => props.onRequestSearch(e.target.value)}
        sx={(theme) => ({
          '& .MuiInputBase-root': {
            width: { xs: 120, sm: 180, md: 240 },
            transition: theme.transitions.create(['width'], {
              duration: theme.transitions.duration.standard,
            }),
            '&.Mui-focused': {
              width: { xs: 170, sm: 250, md: 350 },
            },
          },
        })}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start" disablePointerEvents={true}>
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      <IconButton
        open={props.isReordering}
        titleKey={props.isReordering ? 'save' : 'reorder'}
        onClick={props.onRequestReorder}
      >
        {icon}
      </IconButton>
    </Stack>
  );
};
