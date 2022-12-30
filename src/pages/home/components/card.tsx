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
import { TranslatedText } from '~/bits';
import { locales } from '~/i18n';
import { ListPreview } from '~/types';
import { ListItem } from './list-item';

type Props = {
  list: ListPreview;
};

export const Card = ({ list }: Props) => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  const handleClick = () => {
    navigate(`${list.id}`);
  };

  const updatedAt = new Date(list.updatedAt);

  const products = list.items.map((x, i) => (
    <ListItem key={`list-item-${x.id}-${i}`} item={x} />
  ));

  const productsContent =
    products.length > 0 ? (
      <List dense={true} sx={{ p: 0, mt: 0.5 }}>
        {products}
      </List>
    ) : (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 1,
          py: 1,
        }}
      >
        <TranslatedText textKey="emptyList" />
      </Box>
    );

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
          backgroundImage: 'none',
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
            {format(updatedAt, isToday(updatedAt) ? 'p' : 'd MMM', {
              locale: locales[i18n.resolvedLanguage as keyof typeof locales],
            })}
          </Typography>
        </Box>
        {productsContent}
      </Paper>
    </Grid>
  );
};
