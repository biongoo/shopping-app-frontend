import { Breadcrumbs as BreadcrumbsMui, Link, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link as LinkRR } from 'react-router-dom';

type Props = {
  elements: Array<{
    key: string;
    href?: string;
    ignoreTranslation?: boolean;
  }>;
};

export const Breadcrumbs = ({ elements }: Props) => {
  const { t } = useTranslation();

  const content = elements.map((x, i) =>
    i === elements.length - 1 ? (
      <Typography
        key={x.key}
        color="text.primary"
        sx={{ overflowWrap: 'anywhere' }}
      >
        {x.ignoreTranslation === true ? x.key : t(x.key)}
      </Typography>
    ) : (
      <Link
        key={x.key}
        component={LinkRR}
        underline="hover"
        color="inherit"
        to={`/app/${x.href ?? 'home'}`}
        style={{ overflowWrap: 'anywhere' }}
      >
        {x.ignoreTranslation === true ? x.key : t(x.key)}
      </Link>
    )
  );

  return <BreadcrumbsMui>{content}</BreadcrumbsMui>;
};
