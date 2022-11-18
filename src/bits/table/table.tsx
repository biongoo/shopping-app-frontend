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
  Table as TableMui,
  TableRow,
  TableBody,
  TableCell,
  TableContainer,
} from '@mui/material';
import { Stack } from '@mui/system';
import { useState } from 'react';
import { TranslatedText } from '../text';
import { Header, Row, Toolbar } from './components';
import { Data, HeadCell, Order } from './table-types';

type Props = {
  id: string;
  data: Data[];
  columns: number;
  emptyKey: string;
  headers: HeadCell[];
  isReordering: boolean;
  isFetchingReorder: boolean;
  elementShowingActions?: number;
  renderActions?: (id: number) => JSX.Element;
  onDrag: (firstId: string | number, secondId: string | number) => void;
  onStartReorder: () => void;
  onEndReorder: () => void;
};

const descendingComparator = <T,>(a: T, b: T, orderBy: keyof T) => {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
};

const getComparator = <Key extends keyof Data>(
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

export const Table = (props: Props) => {
  const [search, setSearch] = useState('');
  const [order, setOrder] = useState<Order>('asc');
  const [isDragging, setIsDragging] = useState(false);
  const [orderBy, setOrderBy] = useState<keyof Data>('orderNumber');

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

  const handleRequestSort = (property: keyof Data) => {
    if (props.isReordering) {
      return;
    }

    const isAsc = orderBy === property && order === 'asc';

    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleRequestSearch = (value: string) => {
    if (props.isReordering) {
      return;
    }

    setSearch(value);
  };

  const handleRequestReorder = () => {
    if (props.isReordering === false) {
      setSearch('');
      setOrder('asc');
      setOrderBy('orderNumber');
      props.onStartReorder();
    } else {
      props.onEndReorder();
    }
  };

  const handleRequestDragStart = () => {
    setIsDragging(true);
  };

  const handleRequestDragEnd = (event: DragEndEvent) => {
    setIsDragging(false);

    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    props.onDrag(active.id, over.id);
  };

  const searchLowerCase = search.toLowerCase();

  const preparedData = props.data
    .filter((x) => x.name.toLowerCase().includes(searchLowerCase))
    .sort(getComparator(order, orderBy));

  const rows = preparedData.map((data) => (
    <Row
      key={`row-${props.id}-${data.id}`}
      data={data}
      id={props.id}
      isReordering={props.isReordering}
      isShowingActions={props.elementShowingActions === data.id}
      renderActions={props.renderActions}
    />
  ));

  const emptyRow =
    preparedData.length === 0 ? (
      <TableRow>
        <TableCell
          colSpan={props.isReordering ? props.columns + 1 : props.columns}
          align="center"
        >
          {search === '' ? (
            <TranslatedText variant="h6" textKey={props.emptyKey} />
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

  return (
    <Stack component={Paper} sx={{ minHeight: 0 }}>
      <Toolbar
        search={search}
        isReordering={props.isReordering}
        onRequestSearch={handleRequestSearch}
        onRequestReorder={handleRequestReorder}
        isFetchingReorder={props.isFetchingReorder}
      />
      <TableContainer
        sx={{
          overflow: 'auto',
          touchAction: isDragging ? 'none' : 'auto',
        }}
      >
        <DndContext
          sensors={sensors}
          onDragEnd={handleRequestDragEnd}
          collisionDetection={closestCenter}
          onDragStart={handleRequestDragStart}
          onDragCancel={() => setIsDragging(false)}
          modifiers={[
            restrictToVerticalAxis,
            restrictToWindowEdges,
            restrictToFirstScrollableAncestor,
          ]}
        >
          <TableMui>
            <Header
              id={props.id}
              order={order}
              orderBy={orderBy}
              headers={props.headers}
              isReordering={props.isReordering}
              areActions={Boolean(props.renderActions)}
              onRequestSort={handleRequestSort}
            />
            <TableBody
              sx={{ '& :last-child td, & :last-child th': { border: 0 } }}
            >
              <SortableContext
                items={props.data}
                strategy={verticalListSortingStrategy}
                disabled={!props.isReordering}
              >
                {rows}
                {emptyRow}
              </SortableContext>
            </TableBody>
          </TableMui>
        </DndContext>
      </TableContainer>
    </Stack>
  );
};
