import {
  Autocomplete as AutocompleteMui,
  autocompleteClasses,
  CircularProgress,
  InputAdornment,
  Popper,
  styled,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  createContext,
  forwardRef,
  HTMLAttributes,
  ReactElement,
  Ref,
  useContext,
} from 'react';
import {
  Control,
  Controller,
  FieldValues,
  Path,
  PathValue,
  UseControllerProps,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { FixedSizeList, ListChildComponentProps } from 'react-window';

type PropOption<T extends FieldValues> = {
  value: PathValue<T, Path<T>>;
  label: string;
  inputValue?: string;
};

type Option<T extends FieldValues> = {
  value: PathValue<T, Path<T>>;
  label: string;
};

type RenderOptions<T extends FieldValues> = {
  props: React.HTMLAttributes<HTMLLIElement>;
  option: Option<T>;
}[];

type DynamicAddProps<T extends FieldValues> = {
  emptyAddKey: string;
  defaultValue: PathValue<T, Path<T>>;
  onAddNewItem: (name: string) => void;
};

type AutocompleteProps<T extends FieldValues> = {
  name: string;
  titleKey: string;
  control: Control<T>;
  options: Array<PropOption<T>>;
  required?: boolean;
  isInitialFetching?: boolean;
  dynamicAdd?: DynamicAddProps<T>;
  onChangeId?: () => void;
};

type Props<T extends FieldValues> = UseControllerProps<T> &
  AutocompleteProps<T>;

const LISTBOX_PADDING = 8;

const OuterElementContext = createContext({});
const OuterElementType = forwardRef<HTMLDivElement>(function OuterElementType(
  props,
  ref
) {
  const outerProps = useContext(OuterElementContext);
  return <div ref={ref} {...props} {...outerProps} />;
});

const Row = <T extends FieldValues>(
  props: ListChildComponentProps<RenderOptions<T>>
) => {
  const { data, index, style } = props;
  const dataSet = data[index];

  const inlineStyle = {
    ...style,
    top: (style.top as number) + LISTBOX_PADDING,
  };

  return (
    <Typography component="li" {...dataSet.props} noWrap style={inlineStyle}>
      {dataSet.option.label}
    </Typography>
  );
};

const ListboxComponent = <T extends FieldValues>(
  props: HTMLAttributes<HTMLElement>,
  ref: Ref<HTMLDivElement>
) => {
  const { children, ...other } = props;
  const theme = useTheme();
  const smUp = useMediaQuery(theme.breakpoints.up('sm'));

  const itemData = children as RenderOptions<T>;
  const itemSize = smUp ? 36 : 48;
  const itemCount = itemData.length;
  const height = itemCount > 8 ? 8 * itemSize : itemCount * itemSize;

  return (
    <div ref={ref}>
      <OuterElementContext.Provider value={other}>
        <FixedSizeList
          width="100%"
          overscanCount={5}
          itemSize={itemSize}
          itemData={itemData}
          itemCount={itemCount}
          innerElementType="ul"
          outerElementType={OuterElementType}
          height={height + 2 * LISTBOX_PADDING}
        >
          {(e) => Row(e)}
        </FixedSizeList>
      </OuterElementContext.Provider>
    </div>
  );
};

const FRefListboxComponent = forwardRef(ListboxComponent) as (
  props: HTMLAttributes<HTMLElement> & { ref?: Ref<HTMLDivElement> }
) => ReactElement;

const StyledPopper = styled(Popper)({
  [`& .${autocompleteClasses.listbox}`]: {
    boxSizing: 'border-box',
    '& ul': {
      padding: 0,
      margin: 0,
    },
  },
});

export const Autocomplete = <T extends FieldValues>(props: Props<T>) => {
  const { t } = useTranslation();

  const {
    name,
    options,
    control,
    required,
    titleKey,
    dynamicAdd,
    defaultValue,
    isInitialFetching,
    onChangeId,
  } = props;

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      rules={{ required }}
      render={({ field, fieldState: { error } }) => (
        <AutocompleteMui
          {...field}
          id={name}
          blurOnSelect
          autoHighlight
          disableListWrap
          options={options}
          value={field.value ?? null}
          disabled={isInitialFetching}
          PopperComponent={StyledPopper}
          openText={t('open') ?? 'Open'}
          closeText={t('close') ?? 'Close'}
          clearText={t('clear') ?? 'Clear'}
          ListboxComponent={FRefListboxComponent}
          noOptionsText={t('noOptions') ?? 'No options'}
          renderInput={(params) => (
            <TextField
              {...params}
              label={t(titleKey)}
              error={Boolean(error)}
              helperText={error && t('requiredField')}
              {...(isInitialFetching
                ? {
                    InputProps: {
                      endAdornment: (
                        <InputAdornment
                          position="end"
                          sx={{ position: 'absolute', right: 14 }}
                        >
                          <CircularProgress size={26} />
                        </InputAdornment>
                      ),
                    },
                  }
                : null)}
            />
          )}
          isOptionEqualToValue={(option, value) => option.value === value}
          renderOption={(props, option) =>
            ({ props, option } as unknown as React.ReactNode)
          }
          getOptionLabel={(option) => {
            const value = option as PathValue<T, Path<T>>;
            const item = options.find((x) => x.value === value);

            return item?.label ?? '';
          }}
          filterOptions={(options, state) => {
            const filtered = options.filter((x) =>
              x.label
                .toLocaleLowerCase()
                .includes(state.inputValue.toLocaleLowerCase())
            );

            if (!dynamicAdd) {
              return filtered;
            }

            const { inputValue } = state;

            if (inputValue !== '') {
              if (!options.some((x) => inputValue === x.label)) {
                filtered.push({
                  inputValue,
                  value: dynamicAdd.defaultValue,
                  label: t('addItem', { item: inputValue }),
                });
              }
            } else {
              filtered.push({
                inputValue: '',
                value: dynamicAdd.defaultValue,
                label: t(dynamicAdd.emptyAddKey),
              });
            }

            return filtered;
          }}
          onChange={(_e, newValue) => {
            if (newValue?.value === field.value) {
              return;
            }

            onChangeId?.();

            if (!newValue) {
              field.onChange(null);
              return;
            }

            const { value, inputValue } = newValue;

            if (
              value === dynamicAdd?.defaultValue &&
              inputValue !== undefined
            ) {
              setTimeout(() => {
                dynamicAdd?.onAddNewItem(inputValue);
                field.onChange(null);
              });
            } else if (value) {
              field.onChange(value);
            }
          }}
        />
      )}
    />
  );
};
