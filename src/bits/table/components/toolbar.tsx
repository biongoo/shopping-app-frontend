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
  isReordering?: boolean;
  isFetchingReorder?: boolean;
  onReorder: () => void;
  onSearch: (value: string) => void;
};

const getReorderIcon = (isReordering: boolean, isFetchingReorder?: boolean) => {
  let reorderIcon = <ReorderIcon />;

  if (isFetchingReorder) {
    reorderIcon = <CircularProgress sx={{ p: 1 }} />;
  } else if (isReordering === true) {
    reorderIcon = <CheckIcon />;
  }

  return reorderIcon;
};

export const Toolbar = (props: Props) => {
  const { t } = useTranslation();

  const reorderButton =
    props.isReordering !== undefined ? (
      <IconButton
        open={props.isReordering}
        titleKey={props.isReordering ? 'save' : 'reorder'}
        onClick={props.onReorder}
      >
        {getReorderIcon(props.isReordering, props.isFetchingReorder)}
      </IconButton>
    ) : null;

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
        placeholder={t('search') ?? ''}
        disabled={props.isReordering}
        onChange={(e) => props.onSearch(e.target.value)}
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
      {reorderButton}
    </Stack>
  );
};
