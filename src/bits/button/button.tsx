import LoadingButton from '@mui/lab/LoadingButton';
import { ComponentProps } from 'react';
import { useTranslation } from 'react-i18next';

type Props = Pick<
  ComponentProps<typeof LoadingButton>,
  'onClick' | 'variant' | 'color' | 'type' | 'loading' | 'fullWidth'
> & {
  textKey: string;
};

export const Button = (props: Props) => {
  const { t } = useTranslation();

  return (
    <LoadingButton
      type={props.type}
      variant={props.variant ?? 'outlined'}
      color={props.color ?? 'primary'}
      onMouseDown={props.onClick}
      loading={props.loading}
      fullWidth={props.fullWidth}
    >
      {t(props.textKey)}
    </LoadingButton>
  );
};
