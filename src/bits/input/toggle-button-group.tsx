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
  translationKey: string;
  control: Control<T>;
  defaultValue: PathValue<T, Path<T>>;
  options: Array<PathValue<T, Path<T>>>;
  multiple?: boolean;
  fullWidth?: boolean;
};

type Props<T extends FieldValues> = UseControllerProps<T> &
  ToggleButtonGroupProps<T>;

export const ToggleButtonGroup = <T extends FieldValues>(props: Props<T>) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));

  const {
    name,
    titleKey,
    options,
    control,
    multiple,
    fullWidth,
    defaultValue,
    translationKey,
  } = props;

  const orientation = isSm ? 'vertical' : 'horizontal';

  const content = options.map((x) => (
    <ToggleButton key={`${name}-${x}`} value={x}>
      {t(`${translationKey}.${x}`)}
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
            color="primary"
            fullWidth={fullWidth}
            orientation={orientation}
            defaultValue={defaultValue}
            exclusive={multiple !== true}
            onChange={(_e, value) => field.onChange(value)}
          >
            {content}
          </ToggleButtonGroupMui>
        </Box>
      )}
    />
  );
};
