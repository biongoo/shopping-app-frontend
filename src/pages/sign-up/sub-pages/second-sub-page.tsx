import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { Box, CircularProgress, Stack, Typography } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import Lottie from 'lottie-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import {
  createUser,
  updateUser,
  verifyForgotKey,
  verifyRegistrationKey,
} from '~/api';
import confetti from '~/assets/lotties/confetti.json';
import { Button, IconButton, Input } from '~/bits';
import { generateOnError, generateOnSuccess } from '~/utils';
import { Stepper } from '../components/stepper';

type Props = {
  type: 'signUp' | 'forgot';
};

type SecondStepProps = Props & {
  onNext: () => void;
};

type SecondStepInputs = {
  email: string;
  password: string;
  confirmPassword: string;
};

const SecondStep = ({ type, onNext }: SecondStepProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { email, key } = useParams();
  const { control, handleSubmit, setError } = useForm<SecondStepInputs>();

  if (!email || !key) {
    return <Navigate to="/" />;
  }

  const queryFn =
    type === 'signUp'
      ? () => verifyRegistrationKey({ email, key })
      : () => verifyForgotKey({ email, key });

  const mutationFn = type === 'signUp' ? createUser : updateUser;

  const url = type === 'signUp' ? '/sign-up' : '/forgot';

  const { isInitialLoading } = useQuery({
    retry: 0,
    queryKey: [type, email, key],
    queryFn,
    onError: generateOnError({ fn: () => navigate(url) }),
  });

  const mutation = useMutation({
    mutationFn,
    onSuccess: generateOnSuccess({ fn: () => onNext() }),
    onError: generateOnError({
      setError,
      fn: (apiError) => {
        if (apiError?.mainError?.key === 'invalidKey') {
          navigate(url);
        }
      },
    }),
  });

  const onSubmit = (data: SecondStepInputs) => {
    if (data.password !== data.confirmPassword) {
      setError('confirmPassword', { message: 'passwordsDoNotMatch' });
      return;
    }

    mutation.mutate({ email, key, password: data.password });
  };

  if (isInitialLoading) {
    return <CircularProgress />;
  }

  const passwordInput = type === 'signUp' ? 'password' : 'newPassword';

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
        label={t(passwordInput)}
        control={control}
        defaultValue=""
        type="password"
        rules={{ minLength: 8 }}
      />
      <Input
        name="confirmPassword"
        label={t('confirmPassword')}
        control={control}
        defaultValue=""
        type="password"
        rules={{ minLength: 8 }}
      />
      <Button
        text={t('continue')}
        variant="contained"
        type="submit"
        loading={mutation.isLoading}
      />
      <Stepper activeStep={2} />
    </Stack>
  );
};

const ThirdStep = ({ type }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const passwordInput =
    type === 'signUp'
      ? 'successfullyRegistered'
      : 'passwordChangedSuccessfully';

  return (
    <Stack width={1} spacing={2.5} maxWidth={500} position="relative">
      <Box>
        <Typography variant="h5">{t(passwordInput)}</Typography>
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

export const SecondSubPage = (props: Props) => {
  const [step, setStep] = useState<2 | 3>(2);

  const handleNextStep = () => {
    setStep(3);
  };

  switch (step) {
    case 2: {
      return <SecondStep type={props.type} onNext={handleNextStep} />;
    }
    case 3: {
      return <ThirdStep type={props.type} />;
    }
    default: {
      return <Navigate to="/" />;
    }
  }
};
