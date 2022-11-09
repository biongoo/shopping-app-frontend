import { Box, Divider, Link, Stack, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link as LinkRR, useNavigate } from 'react-router-dom';
import { logIn } from '~/api';
import { Button, Checkbox, Input } from '~/bits';
import { useAuthStore } from '~/stores';
import { generateOnError, generateOnSuccess } from '~/utils';

type LoginInputs = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export const LogInPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const logInStore = useAuthStore((state) => state.logIn);
  const { control, handleSubmit, reset, setError } = useForm<LoginInputs>();

  const mutation = useMutation({
    mutationFn: logIn,
    onSuccess: generateOnSuccess({
      message: 'successfullyLoggedIn',
      reset,
      fn: (res, req) => {
        logInStore(
          req.rememberMe ? 'local' : 'session',
          res.data.accessToken,
          res.data.refreshToken
        );
      },
    }),
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
      <Box>
        <Typography variant="h5">
          {t('signInTo', { appName: import.meta.env.VITE_APP_TITLE })}
        </Typography>
        <Typography variant="subtitle2" color="text.secondary">
          {t('enterYourDetails')}
        </Typography>
      </Box>
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
      <Input
        name="password"
        label={t('password')}
        control={control}
        defaultValue=""
        type="password"
        rules={{ minLength: 8 }}
      />
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
      >
        <Checkbox
          name="rememberMe"
          label={t('rememberMe')}
          control={control}
          defaultValue={true}
        />
        <Link component={LinkRR} to="/forgot" color="inherit">
          <Typography variant="body1">{t('forgotPasswordQuestion')}</Typography>
        </Link>
      </Stack>
      <Button
        text={t('logIn')}
        variant="contained"
        type="submit"
        loading={mutation.isLoading}
      />
      <Divider>
        <Typography variant="body2">{t('or').toLocaleUpperCase()}</Typography>
      </Divider>
      <Button
        text={t('signUp')}
        variant="contained"
        onClick={() => navigate('sign-up')}
      />
    </Stack>
  );
};
