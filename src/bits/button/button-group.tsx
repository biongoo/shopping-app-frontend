import { Button, ButtonGroup as ButtonGroupMui } from '@mui/material';
import { useTranslation } from 'react-i18next';

type Props = {
  buttons: Array<{
    textKey: string;
    onClick?: () => void;
  }>;
};

export const ButtonGroup = (props: Props) => {
  const { t } = useTranslation();

  const buttons = props.buttons.map((x, i) => (
    <Button key={`${x.textKey}-${i}`} onClick={x.onClick}>
      {t(x.textKey)}
    </Button>
  ));

  return <ButtonGroupMui>{buttons}</ButtonGroupMui>;
};
