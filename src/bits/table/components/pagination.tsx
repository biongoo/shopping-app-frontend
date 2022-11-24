import { TablePagination } from '@mui/material';
import { ChangeEventHandler, MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  page: number;
  count: number;
  rowsPerPage: number;
  onPageChange: (
    event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent> | null,
    page: number
  ) => void;
  onRowsPerPageChange: ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  >;
};

export const Pagination = (props: Props) => {
  const { page, count, rowsPerPage, onPageChange, onRowsPerPageChange } = props;

  const { t } = useTranslation();

  const defaultLabelDisplayedRows = ({
    from,
    to,
    count,
  }: {
    from: number;
    to: number;
    count: number;
  }) => {
    return `${from}–${to} ${t('ofTable')} ${count}`;
  };

  return (
    <TablePagination
      page={page}
      component="div"
      labelRowsPerPage={t('perPage')}
      count={count}
      rowsPerPage={rowsPerPage}
      rowsPerPageOptions={[5, 10, 25, 50]}
      SelectProps={{ sx: { ml: 0.5, mr: 2, mt: 0.2 } }}
      sx={{ flexShrink: 0, '& .MuiTablePagination-actions': { ml: 2 } }}
      onPageChange={onPageChange}
      onRowsPerPageChange={onRowsPerPageChange}
      labelDisplayedRows={defaultLabelDisplayedRows}
    />
  );
};
