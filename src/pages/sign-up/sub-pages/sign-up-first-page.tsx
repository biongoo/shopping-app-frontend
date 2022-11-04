import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { Box, Stack, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { createRegistrationUser } from '~/api';
import { Button, IconButton, Input } from '~/bits';
import { generateOnError, generateOnSuccess } from '~/utils';
import { Stepper } from '../components/stepper';

type SignUpFirstInputs = {
  email: string;
};

export const SignUpFirstPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { control, handleSubmit, setError, reset } =
    useForm<SignUpFirstInputs>();

  const mutation = useMutation({
    mutationFn: createRegistrationUser,
    onSuccess: generateOnSuccess({ reset }),
    onError: generateOnError({ setError }),
  });

  return (
    <Stack
      width={1}
      spacing={2.5}
      maxWidth={500}
      component="form"
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit((x) => mutation.mutate(x))}
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
        patternErrorMessage="invalidEmail"
        rules={{
          pattern:
            // eslint-disable-next-line unicorn/no-unsafe-regex, unicorn/better-regex
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        }}
      />
      <Button
        text={t('continue')}
        variant="contained"
        type="submit"
        loading={mutation.isLoading}
      />
      <Stepper activeStep={1} />
    </Stack>
  );
};
