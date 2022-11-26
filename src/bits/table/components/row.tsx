import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import { TableCell, TableRow } from '@mui/material';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Column, Data } from '../table-types';

type Props<T> = {
  name: string;
  data: Data<T>;
  isReordering: boolean;
  isShowingActions: boolean;
  columns: Array<Column<Data<T>>>;
};

export const Row = <T,>(props: Props<T>) => {
  const { data, name, isShowingActions, isReordering, columns } = props;

  const { i18n } = useTranslation();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isSorting,
  } = useSortable({ id: data.id });

  let pointer = 'auto';

  if (isSorting) {
    pointer = 'grabbing';
  } else if (isReordering) {
    pointer = 'grab';
  }

  const memorizedRowContent = useMemo(() => {
    const cells = columns.map((x, i) => (
      <TableCell
        key={`cell-${name}-${data.id}-${i}-${x.labelKey}`}
        sx={{
          pl: !isReordering && i === 0 ? { xs: 2, sm: 4 } : 2,
          pr: i === columns.length - 1 ? { xs: 1, sm: 2 } : 0,
          py: x.py,
          textAlign: x.align ?? 'left',
        }}
      >
        {x.render(data, i, isReordering)}
      </TableCell>
    ));

    const reorderCell = isReordering && (
      <TableCell sx={{ py: 1 }}>
        <DragHandleIcon sx={{ display: 'block' }} />
      </TableCell>
    );

    return (
      <>
        {reorderCell}
        {cells}
      </>
    );
  }, [isReordering, isShowingActions, data, i18n.language]);

  return (
    <TableRow
      ref={setNodeRef}
      selected={isDragging}
      style={{
        transition,
        cursor: pointer,
        transform: CSS.Transform.toString(transform),
        touchAction: isReordering ? 'manipulation' : 'auto',
      }}
      {...attributes}
      {...listeners}
    >
      {memorizedRowContent}
    </TableRow>
  );
};
