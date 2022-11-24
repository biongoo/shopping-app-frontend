import {
  closestCenter,
  DndContext,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  restrictToFirstScrollableAncestor,
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from '@dnd-kit/modifiers';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  Paper,
  Stack,
  Table as TableMui,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@mui/material';
import { useState } from 'react';
import { TranslatedText } from '../text';
import { Header, Pagination, Row, Toolbar } from './components';
import { Column, Data, Order } from './table-types';

type Props<T> = {
  data: Data<T>[];
  name: string;
  emptyKey: string;
  columns: Array<Column<Data<T>>>;
  isReordering?: boolean;
  isShowingActions?: boolean;
  isFetchingReorder?: boolean;
  defaultOrderBy?: keyof Data<T>;
  onEndReorder?: () => void;
  onStartReorder?: () => void;
  onDrag?: (firstId: string | number, secondId: string | number) => void;
};

const createColumns = <T,>(creator: () => Array<Column<T>>) => creator();

const descendingComparator = <T,>(a: T, b: T, orderBy: keyof T) => {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
};

const getComparator = <Key extends string | number>(
  order: Order,
  orderBy: Key
): ((
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number) => {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
};

const TableComponent = <T,>(props: Props<T>) => {
  const {
    data,
    name,
    columns,
    emptyKey,
    isReordering,
    defaultOrderBy,
    isShowingActions,
    isFetchingReorder,
    onDrag,
    onEndReorder,
    onStartReorder,
  } = props;

  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [order, setOrder] = useState<Order>('asc');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState<Omit<keyof Data<T>, 'actions'>>(
    defaultOrderBy ?? 'id'
  );

  const sensors = useSensors(
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    }),
    useSensor(MouseSensor, {
      activationConstraint: {
        delay: 0,
        tolerance: 5,
      },
    })
  );

  const handleSort = (property: Omit<keyof Data<T>, 'actions'>) => {
    if (isReordering) {
      return;
    }

    const isAsc = orderBy === property && order === 'asc';

    setOrderBy(property);
    setOrder(isAsc ? 'desc' : 'asc');
  };

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  const handleReorder = () => {
    if (isReordering === false) {
      setSearch('');
      setOrder('asc');
      setOrderBy(defaultOrderBy ?? 'id');
      onStartReorder?.();
    } else {
      onEndReorder?.();
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    onDrag?.(active.id, over.id);
  };

  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(Number.parseInt(e.target.value, 10));
    setPage(0);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const searchLowerCase = search.toLowerCase();

  const filteredData = data.filter((x) =>
    x.name.toLowerCase().includes(searchLowerCase)
  );

  const sortedData = orderBy
    ? columns.find((x) => x.dataKey === orderBy)?.isOrdering
      ? filteredData.sort(
          getComparator(order, orderBy as unknown as string | number)
        )
      : filteredData
    : filteredData;

  const rowsData =
    isReordering === undefined
      ? sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      : sortedData;

  const rows =
    rowsData.length > 0
      ? rowsData.map((x, i) => (
          <Row<T>
            key={`row-${name}-${i}-${x.id}`}
            data={x}
            name={name}
            columns={columns}
            isReordering={isReordering === true}
            isShowingActions={isShowingActions === true}
          />
        ))
      : null;

  const tableBodyContent =
    isReordering !== undefined ? (
      <SortableContext
        items={data}
        strategy={verticalListSortingStrategy}
        disabled={!isReordering}
      >
        {rows}
      </SortableContext>
    ) : (
      rows
    );

  const emptyRow =
    rowsData.length === 0 ? (
      <TableRow>
        <TableCell align="center" colSpan={columns.length}>
          {search === '' ? (
            <TranslatedText variant="h6" textKey={emptyKey} />
          ) : (
            <>
              <TranslatedText
                mb={1}
                variant="h6"
                textKey="notFound"
                sx={{ fontWeight: 'bold' }}
              />
              <TranslatedText
                textKey="notResultFound"
                options={{ item: search }}
              />
              <TranslatedText textKey="tryCheckTypos" />
            </>
          )}
        </TableCell>
      </TableRow>
    ) : null;

  const table = (
    <TableMui>
      <Header<T>
        name={name}
        order={order}
        orderBy={orderBy}
        columns={columns}
        isReordering={isReordering}
        onSort={handleSort}
      />
      <TableBody
        sx={{
          ...(isReordering !== undefined
            ? { '& > tr:last-child > td': { border: 0 } }
            : undefined),
        }}
      >
        {tableBodyContent}
        {emptyRow}
      </TableBody>
    </TableMui>
  );

  const tableContent =
    isReordering !== undefined ? (
      <DndContext
        sensors={sensors}
        onDragEnd={handleDragEnd}
        collisionDetection={closestCenter}
        onDragCancel={handleDragEnd}
        modifiers={[
          restrictToVerticalAxis,
          restrictToWindowEdges,
          restrictToFirstScrollableAncestor,
        ]}
      >
        {table}
      </DndContext>
    ) : (
      table
    );

  const tablePagination =
    isReordering === undefined ? (
      <Pagination
        page={page}
        count={sortedData.length}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    ) : null;

  return (
    <Stack
      elevation={4}
      component={Paper}
      sx={{ display: 'flex', overflow: 'auto', m: 1 }}
    >
      <Toolbar
        search={search}
        isReordering={isReordering}
        isFetchingReorder={isFetchingReorder}
        onSearch={handleSearch}
        onReorder={handleReorder}
      />
      <TableContainer
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {tableContent}
      </TableContainer>
      {tablePagination}
    </Stack>
  );
};

export const Table = Object.assign(TableComponent, {
  createColumns,
});
