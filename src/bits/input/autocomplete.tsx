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
  UseControllerProps,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';

type Option<K> = {
  value: K;
  label: string;
  shouldBeTranslated: boolean;
};

type RenderOptions<K> = {
  props: React.HTMLAttributes<HTMLLIElement>;
  option: Option<K>;
}[];

type AutocompleteProps<K, T extends FieldValues> = {
  name: string;
  titleKey: string;
  control: Control<T>;
  options: Array<Option<K>>;
};

type Props<K, T extends FieldValues> = UseControllerProps<T> &
  AutocompleteProps<K, T>;

const LISTBOX_PADDING = 8;

const OuterElementContext = createContext({});
const OuterElementType = forwardRef<HTMLDivElement>(function OuterElementType(
  props,
  ref
) {
  const outerProps = useContext(OuterElementContext);
  return <div ref={ref} {...props} {...outerProps} />;
});

const Row = <K,>(props: ListChildComponentProps<RenderOptions<K>>) => {
  const { t } = useTranslation();

  const { data, index, style } = props;
  const dataSet = data[index];

  const inlineStyle = {
    ...style,
    top: (style.top as number) + LISTBOX_PADDING,
  };

  const label = dataSet.option.shouldBeTranslated
    ? t(dataSet.option.label)
    : dataSet.option.label;

  return (
    <Typography component="li" {...dataSet.props} noWrap style={inlineStyle}>
      {label}
    </Typography>
  );
};

const ListboxComponent = <K,>(
  props: HTMLAttributes<HTMLElement>,
  ref: Ref<HTMLDivElement>
) => {
  const { children, ...other } = props;
  const theme = useTheme();
  const smUp = useMediaQuery(theme.breakpoints.up('sm'));

  const itemData = children as RenderOptions<K>;
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
          {Row}
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

export const Autocomplete = <K, T extends FieldValues>(props: Props<K, T>) => {
  const { t } = useTranslation();

  const { name, titleKey, options, control, defaultValue } = props;

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field }) => (
        <AutocompleteMui
          {...field}
          id={name}
          blurOnSelect
          autoHighlight
          disableListWrap
          PopperComponent={StyledPopper}
          ListboxComponent={FRefListboxComponent}
          options={options}
          renderInput={(params) => (
            <TextField {...params} label={t(titleKey)} />
          )}
          renderOption={(props, option) =>
            ({ props, option } as unknown as React.ReactNode)
          }
          getOptionLabel={(option) => {
            let output = '';

            if (typeof option === 'string') {
              output = option;
            } else {
              output = option.shouldBeTranslated
                ? t(option.label)
                : option.label;
            }

            return output;
          }}
          isOptionEqualToValue={(option, value) => option.value === value.value}
          value={field.value || null}
          onChange={(_e, newValue) => {
            field.onChange(newValue);
          }}
        />
      )}
    />
  );
};
