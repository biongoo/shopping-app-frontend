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

type CheckboxProps<T extends FieldValues> = {
  name: string;
  label: string;
  control: Control<T>;
  defaultValue: PathValue<T, Path<T>>;
  sx?: SxProps;
  disabled?: boolean;
};

type Props<T extends FieldValues> = UseControllerProps<T> & CheckboxProps<T>;

export const Checkbox = <T extends FieldValues>(props: Props<T>) => {
  const { name, label, control, defaultValue, sx, disabled } = props;

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field }) => (
        <FormControlLabel
          label={label}
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
