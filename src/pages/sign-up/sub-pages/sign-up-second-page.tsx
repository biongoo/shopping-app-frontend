import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { Box, Stack, Typography } from '@mui/material';
import Lottie from 'lottie-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import confetti from '~/assets/lotties/confetti.json';
import { Button, IconButton, Input } from '~/bits';
/* import { useUiStore } from '~/stores'; */
import { Stepper } from '../components/stepper';

type SignUpSecondInputs = {
  email: string;
  password: string;
  confirmPassword: string;
};

const SignUpSecondStep = (props: { onNext: () => void }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { email, key } = useParams();
  /* const showAlert = useUiStore((store) => store.showAlert); */
  const { control, handleSubmit, setError } = useForm<SignUpSecondInputs>();

  const onSubmit = (data: SignUpSecondInputs) => {
    if (data.password !== data.confirmPassword) {
      setError('confirmPassword', { message: 'passwordsDoNotMatch' });
      return;
    }
    /* showAlert({
      time: 60,
      variant: 'warning',
      title: 'Warning',
      body: "An e-mail confirming the first stage of registration has already been sent. Don't worry, we sent it again and extended the time for confirmation.",
    }); */
    props.onNext();
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
          <Typography variant="h5">{t('justOneMoreStep')}</Typography>
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
        defaultValue={email ?? ''}
        disabled={true}
      />
      <Input
        name="password"
        label={t('password')}
        control={control}
        defaultValue=""
        type="password"
        rules={{ minLength: 6 }}
      />
      <Input
        name="confirmPassword"
        label={t('confirmPassword')}
        control={control}
        defaultValue=""
        type="password"
        rules={{ minLength: 6 }}
      />
      <Button text={t('continue')} variant="contained" type="submit" />
      <Stepper activeStep={2} />
    </Stack>
  );
};

const SignUpThirdStep = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Stack width={1} spacing={2.5} maxWidth={500} position="relative">
      <Box>
        <Typography variant="h5">{t('successfullyRegistered')}</Typography>
        <Typography variant="subtitle2" color="text.secondary">
          {t('letsDoShopping')}
        </Typography>
      </Box>
      <Button
        text={t('logIn')}
        variant="contained"
        onClick={() => navigate('/')}
      />
      <Lottie
        animationData={confetti}
        loop={false}
        style={{
          height: '80vh',
          width: 'inherit',
          position: 'absolute',
          left: '50%',
          top: '40%',
          zIndex: -1,
          transform: 'translate(-50%, -50%)',
        }}
      />
      <Stepper activeStep={3} />
    </Stack>
  );
};

export const SignUpSecondPage = () => {
  const [step, setStep] = useState<2 | 3>(2);

  const handleNextStep = () => {
    setStep(3);
  };

  switch (step) {
    case 2: {
      return <SignUpSecondStep onNext={handleNextStep} />;
    }
    case 3: {
      return <SignUpThirdStep />;
    }
    default: {
      return <Navigate to="/" />;
    }
  }
};
