import { Checkbox as CheckboxMui, FormControlLabel } from '@mui/material';
import { SxProps } from '@mui/system';
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
  labelKey: string;
  control: Control<T>;
  defaultValue: PathValue<T, Path<T>>;
  sx?: SxProps;
  disabled?: boolean;
};

type Props<T extends FieldValues> = UseControllerProps<T> & CheckboxProps<T>;

export const Checkbox = <T extends FieldValues>(props: Props<T>) => {
  const { t } = useTranslation();

  const { name, labelKey, control, defaultValue, sx, disabled } = props;

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field }) => (
        <FormControlLabel
          label={t(labelKey)}
          control={
            <CheckboxMui
              {...field}
              sx={sx}
              id={name}
              disabled={disabled}
              defaultChecked={defaultValue}
            />
          }
        />
      )}
    />
  );
};
