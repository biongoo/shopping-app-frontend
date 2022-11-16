import {
  Stack,
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

type CheckboxProps<T extends FieldValues> = {
  name: string;
  titleKey: string;
  control: Control<T>;
  defaultValue: PathValue<T, Path<T>>;
  options: Array<PathValue<T, Path<T>>>;
};

type Props<T extends FieldValues> = UseControllerProps<T> & CheckboxProps<T>;

export const ToggleButtonGroup = <T extends FieldValues>(props: Props<T>) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));

  const { name, titleKey, options, control, defaultValue } = props;

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
        <Stack>
          <Typography mb={1}>{t(titleKey)}:</Typography>
          <ToggleButtonGroupMui
            sx={{ margin: 'auto' }}
            {...field}
            id={name}
            exclusive
            color="primary"
            orientation={orientation}
            defaultValue={defaultValue}
          >
            {content}
          </ToggleButtonGroupMui>
        </Stack>
      )}
    />
  );
};
