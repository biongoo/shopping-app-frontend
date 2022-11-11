import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { InputAdornment, SxProps, TextField } from '@mui/material';
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
  labelKey: string;
  control: Control<T>;
  defaultValue: PathValue<T, Path<T>>;
  sx?: SxProps;
  type?: 'password';
  disabled?: boolean;
  onlyNumbers?: boolean;
  patternErrorMessage?: string;
};

type Props<T extends FieldValues> = UseControllerProps<T> & InputProps<T>;

export const Input = <T extends FieldValues>(props: Props<T>) => {
  const {
    name,
    control,
    labelKey,
    defaultValue,
    sx,
    type,
    rules,
    disabled,
    onlyNumbers,
    patternErrorMessage,
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
      case 'pattern': {
        return t(patternErrorMessage ?? 'invalidField');
      }
      default: {
        return t(x.message ?? 'invalidField');
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
          label={t(labelKey)}
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
                    titleKey={isVisible ? 'hidePassword' : 'showPassword'}
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
