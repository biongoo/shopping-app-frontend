import { Box, Divider, Link, Stack } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Link as LinkRR, useNavigate } from 'react-router-dom';
import { logIn } from '~/api';
import { Button, Checkbox, Input, TranslatedText } from '~/bits';
import { useAuthStore } from '~/stores';
import { generateOnError, generateOnSuccess } from '~/utils';

type LoginInputs = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export const LogInPage = () => {
  const navigate = useNavigate();
  const mutation = useMutation(logIn);
  const logInStore = useAuthStore((state) => state.logIn);
  const { control, handleSubmit, reset, setError } = useForm<LoginInputs>({
    defaultValues: { email: '', password: '', rememberMe: true },
  });

  const onSubmit = (data: LoginInputs) => {
    const preparedData = {
      email: data.email,
      password: data.password,
    };

    mutation.mutate(preparedData, {
      onSuccess: generateOnSuccess({
        message: 'successfullyLoggedIn',
        reset,
        fn: (res) => {
          logInStore(
            data.rememberMe ? 'local' : 'session',
            res.data.accessToken,
            res.data.refreshToken
          );
        },
      }),
      onError: generateOnError({ setError }),
    });
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
      <Box>
        <TranslatedText
          variant="h5"
          textKey="signInTo"
          options={{ appName: import.meta.env.VITE_APP_TITLE }}
        />
        <TranslatedText
          variant="subtitle2"
          color="text.secondary"
          textKey="enterYourDetails"
        />
      </Box>
      <Input
        name="email"
        labelKey="email"
        control={control}
        patternErrorMessage="invalidEmail"
        rules={{
          pattern:
            // eslint-disable-next-line unicorn/no-unsafe-regex, unicorn/better-regex
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        }}
      />
      <Input
        name="password"
        type="password"
        control={control}
        labelKey="password"
        rules={{ minLength: 8 }}
      />
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
      >
        <Checkbox name="rememberMe" labelKey="rememberMe" control={control} />
        <Link component={LinkRR} to="/forgot" color="inherit">
          <TranslatedText variant="body1" textKey="forgotPasswordQuestion" />
        </Link>
      </Stack>
      <Button
        type="submit"
        textKey="logIn"
        variant="contained"
        loading={mutation.isLoading}
      />
      <Divider>
        <TranslatedText variant="body2" textKey="orUpperCase" />
      </Divider>
      <Button
        textKey="signUp"
        variant="contained"
        onClick={() => navigate('sign-up')}
      />
    </Stack>
  );
};
