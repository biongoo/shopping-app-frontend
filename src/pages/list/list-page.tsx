import CommentIcon from '@mui/icons-material/Comment';
import {
  Box,
  Checkbox,
  CircularProgress,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Stack,
  Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { getList } from '~/api';
import { Breadcrumbs } from '~/bits';
import { QueryKey } from '~/enums';
import { generateOnError } from '~/utils';

export const ListPage = () => {
  const { listId } = useParams();
  const [checked, setChecked] = React.useState([0]);

  if (!listId || Number.isNaN(listId)) {
    return <Navigate to="/" />;
  }

  const listIdAsNumber = Number(listId);

  const { data, isInitialLoading } = useQuery({
    queryKey: [QueryKey.lists, listIdAsNumber],
    queryFn: () => getList({ id: listIdAsNumber }),
    onError: generateOnError(),
  });

  if (isInitialLoading) {
    return (
      <Box textAlign="center">
        <CircularProgress />
      </Box>
    );
  }

  const list = data?.data;

  if (!list) {
    return <Navigate to="home" />;
  }

  const breadcrumbs = [
    { key: 'home' },
    { key: list.name, ignoreTranslation: true },
  ];

  const handleToggle = (value: number) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  return (
    <Stack sx={{ flexGrow: 1, overflow: 'hidden' }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={4}
      >
        <Box>
          <Typography variant="h5" gutterBottom>
            {list.name}
          </Typography>
          <Breadcrumbs elements={breadcrumbs} />
        </Box>
        {/* <AddItem /> */}
      </Stack>
      <List
        sx={{
          width: '100%',
          bgcolor: 'background.paper',
          position: 'relative',
          overflow: 'auto',
          '& ul': { padding: 0 },
        }}
        subheader={<li />}
      >
        {[0, 1, 2, 3, 4].map((sectionId) => (
          <li key={`section-${sectionId}`}>
            <ul>
              <ListSubheader>{`I'm sticky ${sectionId}`}</ListSubheader>
              {[0, 1, 2, 3, 4].map((value) => (
                <ListItem
                  key={value}
                  secondaryAction={
                    <IconButton edge="end" aria-label="comments">
                      <CommentIcon />
                    </IconButton>
                  }
                  disablePadding
                  dense={true}
                >
                  <ListItemButton
                    role={undefined}
                    onClick={handleToggle(value)}
                    dense
                  >
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={checked.includes(value)}
                        tabIndex={-1}
                        disableRipple
                      />
                    </ListItemIcon>
                    <ListItemText
                      id={`checkbox-list-label-${value}`}
                      primary={`Line item ${value + 1}`}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </ul>
          </li>
        ))}
      </List>
    </Stack>
  );
};
