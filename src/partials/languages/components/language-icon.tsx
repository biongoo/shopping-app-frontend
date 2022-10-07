import { Box } from '@mui/material';

type Props = {
  src: string;
};

export const LanguageIcon = (props: Props) => {
  return (
    <Box
      component="img"
      src={props.src}
      alt=""
      sx={{
        width: 28,
        height: 22,
        borderRadius: 1,
        boxShadow: 4,
        textIndent: '100%',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
      }}
    />
  );
};
