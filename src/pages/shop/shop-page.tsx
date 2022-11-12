import {
  Box,
  CircularProgress,
  emphasize,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getShops } from '~/api';
import { Breadcrumbs, TranslatedText } from '~/bits';
import { AddShopModal } from './components';

const breadcrumbs = [{ key: 'home' }, { key: 'shops' }];

export const ShopPage = () => {
  const { data: res, isInitialLoading } = useQuery({
    queryKey: ['shops'],
    queryFn: getShops,
  });

  if (isInitialLoading) {
    return (
      <Box textAlign="center">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={4}
      >
        <Box>
          <TranslatedText variant="h5" gutterBottom textKey="shops" />
          <Breadcrumbs elements={breadcrumbs} />
        </Box>
        <AddShopModal />
      </Stack>
      <TableContainer component={Paper}>
        <Table>
          <TableHead
            sx={{
              backgroundColor: (theme) =>
                emphasize(theme.palette.background.paper, 0.1),
            }}
          >
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Name</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {res?.data.map((row) => (
              <TableRow
                key={row.name}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.orderNumber}
                </TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell align="right">{row.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
