import {
  emphasize,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Data, HeadCell, Order } from '../table-types';

type Props = {
  id: string;
  order: Order;
  orderBy: string;
  headers: HeadCell[];
  isReordering: boolean;
  onRequestSort: (property: keyof Data) => void;
};

export const Header = (props: Props) => {
  const { t } = useTranslation();

  const cells = props.headers.map((x, i) => {
    const translatedLabel = x.labelKey === 'orderNumber' ? '#' : t(x.labelKey);

    return (
      <TableCell
        key={`${props.id}-${x.labelKey}`}
        sx={{
          pl: i === 0 && !props.isReordering ? 4 : 2,
        }}
      >
        <TableSortLabel
          disabled={props.isReordering}
          active={props.orderBy === x.labelKey}
          direction={props.orderBy === x.labelKey ? props.order : 'asc'}
          onClick={() => props.onRequestSort(x.labelKey)}
        >
          {translatedLabel}
        </TableSortLabel>
      </TableCell>
    );
  });

  const reorderCell = props.isReordering && <TableCell></TableCell>;

  return (
    <TableHead
      sx={{
        backgroundColor: (theme) =>
          emphasize(theme.palette.background.paper, 0.1),
      }}
    >
      <TableRow>
        {reorderCell}
        {cells}
        <TableCell></TableCell>
      </TableRow>
    </TableHead>
  );
};
