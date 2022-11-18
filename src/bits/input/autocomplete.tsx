import {
  Autocomplete as AutocompleteMui,
  autocompleteClasses,
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
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import {
  Control,
  Controller,
  FieldValues,
  Path,
  PathValue,
  UseControllerProps,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';

type PropOption<T extends FieldValues> = {
  value: PathValue<T, Path<T>>;
  label: string;
  shouldBeTranslated: boolean;
};

type Option<T extends FieldValues> = {
  value: PathValue<T, Path<T>>;
  label: string;
};

type RenderOptions<T extends FieldValues> = {
  props: React.HTMLAttributes<HTMLLIElement>;
  option: Option<T>;
}[];

type AutocompleteProps<T extends FieldValues> = {
  name: string;
  titleKey: string;
  control: Control<T>;
  options: Array<PropOption<T>>;
  required?: boolean;
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

  const { name, titleKey, options, control, defaultValue, required } = props;

  const translatedOptions = options.map((x) => ({
    value: x.value,
    label: x.shouldBeTranslated ? t(x.label) : x.label,
  }));

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      rules={{
        required,
      }}
      render={({ field, fieldState: { error } }) => (
        <AutocompleteMui
          {...field}
          id={name}
          blurOnSelect
          autoHighlight
          disableListWrap
          value={field.value || null}
          options={translatedOptions}
          PopperComponent={StyledPopper}
          openText={t('open') ?? 'Open'}
          closeText={t('close') ?? 'Close'}
          clearText={t('clear') ?? 'Clear'}
          ListboxComponent={FRefListboxComponent}
          noOptionsText={t('noOptions') ?? 'No options'}
          renderInput={(params) => (
            <TextField
              {...params}
              error={Boolean(error)}
              helperText={error && t('requiredField')}
              label={t(titleKey)}
            />
          )}
          isOptionEqualToValue={(option, value) => option.value === value}
          renderOption={(props, option) =>
            ({ props, option } as unknown as React.ReactNode)
          }
          getOptionLabel={(option) => {
            const value = option as PathValue<T, Path<T>>;
            const item = translatedOptions.find((x) => x.value === value);

            return item?.label ?? '';
          }}
          filterOptions={(filterOptions, state) =>
            filterOptions.filter((x) =>
              x.label
                .toLocaleLowerCase()
                .includes(state.inputValue.toLocaleLowerCase())
            )
          }
          onChange={(_e, newValue) => {
            field.onChange(newValue?.value);
          }}
        />
      )}
    />
  );
};
