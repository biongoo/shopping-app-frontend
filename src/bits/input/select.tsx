import {
  FormControl,
  InputLabel,
  MenuItem,
  Select as SelectMui,
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

type Option<T extends FieldValues> = {
  value: PathValue<T, Path<T>>;
  itemKey?: string;
  itemName?: string;
};

type CheckboxProps<T extends FieldValues> = {
  name: string;
  labelKey: string;
  control: Control<T>;
  defaultValue: PathValue<T, Path<T>>;
  options: Option<T>[];
};

type Props<T extends FieldValues> = UseControllerProps<T> & CheckboxProps<T>;

export const Select = <T extends FieldValues>(props: Props<T>) => {
  const { t } = useTranslation();

  const { name, labelKey, control, defaultValue, options } = props;

  const label = t(labelKey);
  const labelId = `${name}-label`;

  const content = options.map((x) => (
    <MenuItem key={`${name}-${x.itemName ?? x.itemKey}`} value={x.value}>
      {x.itemName ?? t(x.itemKey ?? '')}
    </MenuItem>
  ));

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field }) => (
        <FormControl fullWidth>
          <InputLabel id={labelId}>{label}</InputLabel>
          <SelectMui {...field} labelId={labelId} id={name} label={label}>
            {content}
          </SelectMui>
        </FormControl>
      )}
    />
  );
};
