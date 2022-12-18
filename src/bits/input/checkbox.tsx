import { Checkbox as CheckboxMui, FormControlLabel } from '@mui/material';
import { SxProps } from '@mui/system';
import {
  Control,
  Controller,
  FieldValues,
  UseControllerProps,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';

type CheckboxProps<T extends FieldValues> = {
  name: string;
  labelKey: string;
  control: Control<T>;
  sx?: SxProps;
  disabled?: boolean;
};

type Props<T extends FieldValues> = UseControllerProps<T> & CheckboxProps<T>;

export const Checkbox = <T extends FieldValues>(props: Props<T>) => {
  const { t } = useTranslation();

  const { name, labelKey, control, sx, disabled } = props;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, ...rest } }) => (
        <FormControlLabel
          label={t(labelKey)}
          control={
            <CheckboxMui
              {...rest}
              sx={sx}
              id={name}
              disabled={disabled}
              checked={value}
            />
          }
        />
      )}
    />
  );
};
