import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { SxProps } from '@mui/system';
import { useState } from 'react';
import {
  Control,
  Controller,
  FieldError,
  FieldValues,
  Path,
  PathValue,
  UseControllerProps,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { IconButton } from '../button';

type InputProps<T extends FieldValues> = {
  name: string;
  label: string;
  control: Control<T>;
  defaultValue: PathValue<T, Path<T>>;
  sx?: SxProps;
  type?: 'password';
  disabled?: boolean;
  onlyNumbers?: boolean;
};

type Props<T extends FieldValues> = UseControllerProps<T> & InputProps<T>;

export const Input = <T extends FieldValues>(props: Props<T>) => {
  const {
    name,
    label,
    control,
    defaultValue,
    sx,
    type,
    rules,
    disabled,
    onlyNumbers,
  } = props;

  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  const minLength = rules?.minLength ?? 3;
  const maxLength = rules?.maxLength ?? 100;
  const isPassword = type === 'password';

  const getErrorText = (x: FieldError) => {
    switch (x.type) {
      case 'required': {
        return t('requiredField');
      }
      case 'maxLength': {
        return t('maxLengthField', { maxLength });
      }
      case 'minLength': {
        return t('minLengthField', { minLength });
      }
      case 'email': {
        return t('invalidEmail');
      }
      default: {
        return x.message ? t(x.message) : t('invalidField');
      }
    }
  };

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      rules={{
        ...rules,
        required: rules?.required ?? true,
        minLength,
        maxLength,
      }}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          sx={sx}
          id={name}
          label={label}
          disabled={disabled}
          type={isPassword && !isVisible ? 'password' : undefined}
          error={Boolean(error)}
          helperText={error && getErrorText(error)}
          InputProps={{
            ...(isPassword && {
              endAdornment: (
                <InputAdornment position="start">
                  <IconButton
                    edge="end"
                    scale={0.85}
                    open={false}
                    onClick={() => setIsVisible((x) => !x)}
                    title={isVisible ? t('hidePassword') : t('showPassword')}
                  >
                    {isVisible ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }),
          }}
          onChange={(x) => {
            let value = x.target.value;

            if (rules?.maxLength && value.length > rules?.maxLength) {
              return;
            }

            if (onlyNumbers) {
              value = allowOnlyNumber(value);
            }

            return field.onChange(value);
          }}
        />
      )}
    />
  );
};

const allowOnlyNumber = (value: string) => {
  return value.replace(/\D/g, '');
};
