import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { Box, Stack, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button, IconButton, Input } from '~/bits';
import { useUiStore } from '~/stores';
import { Stepper } from '../components/stepper';

type SignUpFirstInputs = {
  email: string;
};

const emailRegex =
  // eslint-disable-next-line unicorn/no-unsafe-regex, unicorn/better-regex
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const SignUpFirstPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const showAlert = useUiStore((store) => store.showAlert);
  const { control, handleSubmit, setError, reset } =
    useForm<SignUpFirstInputs>();

  const onSubmit = (data: SignUpFirstInputs) => {
    if (!emailRegex.test(data.email)) {
      setError('email', { type: 'email' });
      return;
    }

    reset();
    showAlert({
      time: 60,
      variant: 'success',
      titleKey: 'success',
      bodyKey: 'successSendEmail',
    });
    /* showAlert({
      time: 60,
      variant: 'warning',
      title: 'Warning',
      body: "An e-mail confirming the first stage of registration has already been sent. Don't worry, we sent it again and extended the time for confirmation.",
    }); */
  };

  return (
    <Stack
      width={1}
      spacing={2.5}
      maxWidth={500}
      component="form"
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h5">{t('getStartedAbsolutelyFree')}</Typography>
          <Typography variant="subtitle2" color="text.secondary">
            {t('enterYourDetails')}
          </Typography>
        </Box>
        <IconButton
          open={true}
          title={t('goBack')}
          onClick={() => navigate('/')}
        >
          <ArrowBackIosNewIcon />
        </IconButton>
      </Stack>
      <Input
        name="email"
        label={t('email')}
        control={control}
        defaultValue=""
      />
      <Button text={t('continue')} variant="contained" type="submit" />
      <Stepper activeStep={1} />
    </Stack>
  );
};
