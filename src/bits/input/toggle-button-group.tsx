import {
  FormControl,
  FormHelperText,
  FormLabel,
  ToggleButton,
  ToggleButtonGroup as ToggleButtonGroupMui,
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
  control: Control<T>;
  translationKey: string;
  options: Array<PathValue<T, Path<T>>>;
  titleKey?: string;
  multiple?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  withoutLabel?: boolean;
  position?: 'vertical' | 'horizontal';
  onChange?: (value: number, prev: number) => void;
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
    disabled,
    position,
    fullWidth,
    withoutLabel,
    translationKey,
    onChange,
  } = props;

  const orientation = position ?? (isSm ? 'vertical' : 'horizontal');

  const content = options.map((x) => (
    <ToggleButton key={`${name}-${x}`} value={x}>
      {t(`${translationKey}.${x}`)}
    </ToggleButton>
  ));

  return (
    <Controller
      name={name}
      control={control}
      rules={{ required: true }}
      render={({ field, fieldState: { error } }) => (
        <FormControl error={Boolean(error)}>
          {withoutLabel === true ? null : (
            <FormLabel sx={{ mb: 1 }}>{t(titleKey ?? '')}:</FormLabel>
          )}
          <ToggleButtonGroupMui
            sx={{
              margin: 'auto',
              ...(error
                ? {
                    '& > button': {
                      borderColor: 'error.main',
                      color: 'error.main',
                    },
                  }
                : null),
            }}
            {...field}
            id={name}
            color="primary"
            disabled={disabled}
            fullWidth={fullWidth}
            orientation={orientation}
            exclusive={multiple !== true}
            onChange={(_e, value) => {
              if (value === null) {
                return;
              }

              onChange?.(value, field.value);
              field.onChange(value);
            }}
          >
            {content}
          </ToggleButtonGroupMui>
          {error ? (
            <FormHelperText sx={{ m: 0, mt: 0.5 }}>
              {t(error?.message || 'atLeastOneValue')}
            </FormHelperText>
          ) : null}
        </FormControl>
      )}
    />
  );
};
