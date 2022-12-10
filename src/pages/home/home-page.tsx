import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Typography,
  Unstable_Grid2 as Grid,
} from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { Breadcrumbs, TranslatedText } from '~/bits';
import { format, isToday, sub } from 'date-fns';
import { pl, enUS } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';

type List = {
  id: number;
  name: string;
  editDate: Date;
  products: Array<{ name: string; checked: boolean }>;
};

const locales = {
  en: enUS,
  pl,
};

const breadcrumbs = [{ key: 'home' }];

const list: List[] = [
  {
    id: 1,
    name: 'Lista z 09.12.2022',
    editDate: sub(new Date(), {
      days: 1,
    }),
    products: [{ name: 'Apples', checked: false }],
  },
  {
    id: 2,
    name: 'Lista z 10.12.2022',
    editDate: new Date(),
    products: [
      { name: 'Apples', checked: false },
      { name: 'Bread', checked: false },
    ],
  },
  {
    id: 3,
    name: 'Lista z 11.12.2022',
    editDate: new Date(),
    products: [
      { name: 'Apples', checked: true },
      { name: 'Bread', checked: true },
      { name: 'Rum', checked: true },
    ],
  },
  {
    id: 4,
    name: 'Lista z 12.12.2022',
    editDate: new Date(),
    products: [
      { name: 'Apples', checked: false },
      { name: 'Bread', checked: false },
      { name: 'Rum', checked: false },
      { name: 'Vodka', checked: false },
    ],
  },
  {
    id: 5,
    name: 'Lista z 13.12.2022',
    editDate: new Date(),
    products: [
      { name: 'Apples', checked: false },
      { name: 'Bread', checked: false },
      { name: 'Rum', checked: false },
      { name: 'Vodka', checked: false },
      { name: 'Sugar', checked: false },
    ],
  },
  {
    id: 6,
    name: 'Lista z 14.12.2022',
    editDate: new Date(),
    products: [
      { name: 'Tomatoes', checked: false },
      { name: 'Ham', checked: false },
    ],
  },
];

export const HomePage = () => {
  const { i18n } = useTranslation();

  return (
    <Stack sx={{ flexGrow: 1 }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
      >
        <Box>
          <TranslatedText variant="h5" gutterBottom textKey="shoppingLists" />
          <Breadcrumbs elements={breadcrumbs} />
        </Box>
      </Stack>
      <Grid container spacing={2}>
        {list.map((x, i) => (
          <Grid key={`list-${x.id}-${i}`} xs={12} sm={6} lg={4}>
            <Paper sx={{ px: 2, py: 1.5, height: 1 }}>
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
                  {x.name}
                </Typography>
                <Typography variant="subtitle2">
                  {format(x.editDate, isToday(x.editDate) ? 'p' : 'd MMM', {
                    locale:
                      locales[i18n.resolvedLanguage as keyof typeof locales],
                  })}
                </Typography>
              </Box>
              <List dense={true} sx={{ p: 0 }}>
                {x.products.map((y, yi) => (
                  <ListItem key={`list-item-${y.name}-${yi}`} disableGutters>
                    <ListItemIcon sx={{ minWidth: 30 }}>
                      {y.checked ? (
                        <CheckBoxIcon fontSize="inherit" />
                      ) : (
                        <CheckBoxOutlineBlankIcon fontSize="inherit" />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      sx={{
                        textDecoration: y.checked ? 'line-through' : 'none',
                      }}
                    >
                      {y.name}
                    </ListItemText>
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
};
