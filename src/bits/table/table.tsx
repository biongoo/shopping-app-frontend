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
import { Header, Row, Toolbar } from './components';
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

  const [search, setSearch] = useState('');
  const [order, setOrder] = useState<Order>('asc');
  const [isDragging, setIsDragging] = useState(false);
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

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setIsDragging(false);

    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    onDrag?.(active.id, over.id);
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

  const rows =
    sortedData.length > 0
      ? sortedData.map((x, i) => (
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
    sortedData.length === 0 ? (
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
      <TableBody sx={{ '& > tr:last-child > td': { border: 0 } }}>
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
        onDragStart={handleDragStart}
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

  return (
    <Stack component={Paper} sx={{ display: 'flex', overflow: 'auto' }}>
      <Toolbar
        search={search}
        isReordering={isReordering}
        isFetchingReorder={isFetchingReorder}
        onSearch={handleSearch}
        onReorder={handleReorder}
      />
      <TableContainer
        sx={{
          touchAction: isDragging !== undefined ? 'none' : 'auto',
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {tableContent}
      </TableContainer>
    </Stack>
  );
};

export const Table = Object.assign(TableComponent, {
  createColumns,
});
