import {
  Box,
  Button,
  List,
  Paper,
  Typography,
  Unstable_Grid2 as Grid,
} from '@mui/material';
import { format, isToday } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { locales } from '~/i18n';
import { ListPreview } from '~/types';
import { ListItem } from './list-item';

type Props = {
  list: ListPreview;
};

export const Card = ({ list }: Props) => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  const products = list.products.map((x, i) => (
    <ListItem key={`list-item-${x.name}-${i}`} product={x} />
  ));

  const handleClick = () => {
    navigate(`${list.id}`);
  };

  return (
    <Grid xs={12} sm={6} lg={4}>
      <Paper
        sx={{
          px: 2,
          py: 1.5,
          height: 1,
          width: 1,
          textTransform: 'inherit',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          justifyContent: 'flex-start',
        }}
        component={Button}
        onClick={handleClick}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              fontSize: '1.1rem',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {list.name}
          </Typography>
          <Typography variant="subtitle2">
            {format(list.editDate, isToday(list.editDate) ? 'p' : 'd MMM', {
              locale: locales[i18n.resolvedLanguage as keyof typeof locales],
            })}
          </Typography>
        </Box>
        <List dense={true} sx={{ p: 0 }}>
          {products}
        </List>
      </Paper>
    </Grid>
  );
};
