import { Box, Paper, Stack, Typography } from '@mui/material';
import { Breadcrumbs, TranslatedText } from '~/bits';

export const HomePage = () => {
  return (
    <Stack sx={{ flexGrow: 1, overflow: 'auto' }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={4}
      >
        <TranslatedText variant="h5" gutterBottom textKey="home" />
      </Stack>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-around',
          gap: 2,
          px: 0.5,
        }}
      >
        {Array.from({ length: 200 }).map((_x, i) => (
          <Paper key={i} sx={{ p: 2 }}>
            <Typography variant="subtitle1">Lista z 09.12.2022</Typography>
            {i % 30 === 0 ? <div>ok</div> : null}
          </Paper>
        ))}
      </Box>
    </Stack>
  );
};
