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
  titleKey: string;
  control: Control<T>;
  translationKey: string;
  options: Array<PathValue<T, Path<T>>>;
  multiple?: boolean;
  disabled?: boolean;
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
    disabled,
    fullWidth,
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
      rules={{ required: true }}
      render={({ field, fieldState: { error } }) => (
        <FormControl error={Boolean(error)}>
          <FormLabel sx={{ mb: 1 }}>{t(titleKey)}:</FormLabel>
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
