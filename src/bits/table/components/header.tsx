import {
  emphasize,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Column, Data, Order } from '../table-types';

type Props<T> = {
  name: string;
  order: Order;
  columns: Array<Column<Data<T>>>;
  orderBy: Omit<keyof Data<T>, 'actions'>;
  isReordering?: boolean;
  onSort: (property: Omit<keyof Data<T>, 'actions'>) => void;
};

export const Header = <T,>(props: Props<T>) => {
  const { name, order, orderBy, columns, isReordering, onSort } = props;

  const { t } = useTranslation();

  const reorderCell = isReordering ? (
    <TableCell sx={{ width: 0 }}></TableCell>
  ) : null;

  const headers = columns.map((x, i) => (
    <TableCell
      key={`${name}-${i}-${x.labelKey}`}
      sx={{
        width: `${x.width ?? 0}%`,
        pl: !isReordering && i === 0 ? { xs: 2, sm: 4 } : 2,
        textAlign: x.align === 'right' ? 'right' : 'left',
      }}
    >
      {x.isOrdering ? (
        <TableSortLabel
          disabled={isReordering}
          active={orderBy === x.dataKey}
          direction={orderBy === x.labelKey ? order : 'asc'}
          onClick={() => onSort(x.dataKey)}
        >
          {t(x.labelKey)}
        </TableSortLabel>
      ) : (
        t(x.labelKey)
      )}
    </TableCell>
  ));

  return (
    <TableHead
      sx={{
        backgroundColor: (theme) =>
          emphasize(theme.palette.background.paper, 0.1),
      }}
    >
      <TableRow>
        {reorderCell}
        {headers}
      </TableRow>
    </TableHead>
  );
};
