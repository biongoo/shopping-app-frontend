import { Box, Stack, Typography, Divider } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button, Input } from '~/bits';

type LoginInputs = {
  email: string;
  password: string;
};

export const LogInPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { control, handleSubmit } = useForm<LoginInputs>();

  const onSubmit = (data: LoginInputs) => {
    console.log(data);
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
      />
      <Input
        name="password"
        label={t('password')}
        control={control}
        defaultValue=""
        type="password"
      />
      <Button text={t('logIn')} variant="contained" type="submit" />
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
