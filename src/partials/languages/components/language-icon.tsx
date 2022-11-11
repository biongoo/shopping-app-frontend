import { Box } from '@mui/material';

type Props = {
  src: string;
};

export const LanguageIcon = (props: Props) => (
  <Box
    component="img"
    src={props.src}
    alt=""
    sx={{
      width: 26,
      height: 20,
      borderRadius: 1,
      boxShadow: 4,
      textIndent: '100%',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
    }}
  />
);
