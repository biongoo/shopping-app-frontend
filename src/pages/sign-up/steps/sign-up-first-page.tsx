import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { Box, Stack, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button, IconButton, Input } from '~/bits';
import { Stepper } from '../components/stepper';

type SignUpFirstInputs = {
  email: string;
};

export const SignUpFirstStep = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { control, handleSubmit } = useForm<SignUpFirstInputs>();

  const onSubmit = (data: SignUpFirstInputs) => {
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
      <Button text={t('signUp')} variant="contained" type="submit" />
      <Stepper activeStep={1} />
    </Stack>
  );
};
