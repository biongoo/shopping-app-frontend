import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { Box, Stack, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { createRegistrationUser } from '~/api';
import { Button, IconButton, Input } from '~/bits';
import { ApiError } from '~/models';
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

  const mutation = useMutation<undefined, ApiError, SignUpFirstInputs>({
    mutationFn: createRegistrationUser,
    onSuccess: () => {
      reset();
      showAlert({
        time: 60,
        variant: 'success',
        titleKey: 'success',
        bodyKey: 'successSendEmail',
      });
    },
    onError: (apiError) => {
      for (const error of apiError.inputErrors) {
        if (error.inputName) {
          setError(error.inputName as keyof SignUpFirstInputs, {
            message: error.key,
          });
        }
      }
    },
  });

  const onSubmit = (data: SignUpFirstInputs) => {
    if (!emailRegex.test(data.email)) {
      setError('email', { type: 'email' });
      return;
    }

    mutation.mutate(data);
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
