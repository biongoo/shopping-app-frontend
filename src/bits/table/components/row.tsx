import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import { TableCell, TableRow } from '@mui/material';
import { useMemo } from 'react';
import { Data } from '../table-types';

type Props = {
  id: string;
  data: Data;
  isReordering: boolean;
  isShowingActions: boolean;
  renderActions?: (id: number) => JSX.Element;
};

export const Row = (props: Props) => {
  const { id, name, orderNumber, ...otherColumns } = props.data;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isSorting,
  } = useSortable({ id });

  let pointer = 'auto';

  if (isSorting) {
    pointer = 'grabbing';
  } else if (props.isReordering) {
    pointer = 'grab';
  }

  const memorizedRowContent = useMemo(() => {
    const cells: JSX.Element[] = [];

    for (const property in otherColumns) {
      cells.push(
        <TableCell component="div">{otherColumns[property]}</TableCell>
      );
    }

    const reorderCell = props.isReordering && (
      <TableCell
        sx={{
          p: 0,
          pl: 2,
          pt: 0.5,
          width: 0,
        }}
      >
        <DragHandleIcon />
      </TableCell>
    );

    const actions = props.renderActions && (
      <TableCell align="right" sx={{ p: 0, pr: 1 }}>
        {props.renderActions(id)}
      </TableCell>
    );

    return (
      <>
        {reorderCell}
        <TableCell
          scope="row"
          component="th"
          sx={{ pl: props.isReordering ? 2 : 4, width: 0 }}
        >
          {orderNumber}
        </TableCell>
        <TableCell>{name}</TableCell>
        {cells}
        {actions}
      </>
    );
  }, [props.isReordering, props.data, props.isShowingActions]);

  return (
    <TableRow
      ref={setNodeRef}
      selected={isDragging}
      sx={{
        '&:last-child td, &:last-child th': { border: 0 },
        touchAction: props.isReordering ? 'manipulation' : 'auto',
        transform: CSS.Transform.toString(transform),
        transition,
        cursor: pointer,
      }}
      {...attributes}
      {...listeners}
    >
      {memorizedRowContent}
    </TableRow>
  );
};
