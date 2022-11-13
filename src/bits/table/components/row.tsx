import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import { TableCell, TableRow } from '@mui/material';
import { Data } from '../table-types';

type Props = {
  id: string;
  data: Data;
  isReordering: boolean;
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

  const cells: JSX.Element[] = [];

  for (const property in otherColumns) {
    cells.push(<TableCell component="div">{otherColumns[property]}</TableCell>);
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

  let pointer = 'auto';

  if (isSorting) {
    pointer = 'grabbing';
  } else if (props.isReordering) {
    pointer = 'grab';
  }

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
      <TableCell align="right" sx={{ pr: 4 }}>
        Actions
      </TableCell>
    </TableRow>
  );
};
