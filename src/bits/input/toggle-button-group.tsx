import {
  Box,
  ToggleButton,
  ToggleButtonGroup as ToggleButtonGroupMui,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Control,
  Controller,
  FieldValues,
  Path,
  PathValue,
  UseControllerProps,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';

type ToggleButtonGroupProps<T extends FieldValues> = {
  name: string;
  titleKey: string;
  control: Control<T>;
  defaultValue: PathValue<T, Path<T>>;
  options: Array<PathValue<T, Path<T>>>;
  fullWidth?: boolean;
};

type Props<T extends FieldValues> = UseControllerProps<T> &
  ToggleButtonGroupProps<T>;

export const ToggleButtonGroup = <T extends FieldValues>(props: Props<T>) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));

  const { name, titleKey, options, control, fullWidth, defaultValue } = props;

  const orientation = isSm ? 'vertical' : 'horizontal';

  const content = options.map((x) => (
    <ToggleButton key={`${name}-${x}`} value={x}>
      {t(x)}
    </ToggleButton>
  ));

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field }) => (
        <Box>
          <Typography mb={1}>{t(titleKey)}:</Typography>
          <ToggleButtonGroupMui
            sx={{ margin: 'auto' }}
            {...field}
            id={name}
            exclusive
            color="primary"
            fullWidth={fullWidth}
            orientation={orientation}
            defaultValue={defaultValue}
          >
            {content}
          </ToggleButtonGroupMui>
        </Box>
      )}
    />
  );
};