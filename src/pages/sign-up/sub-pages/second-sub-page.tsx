import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { Box, CircularProgress, Stack } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import Lottie from 'lottie-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import {
  createUser,
  updateUser,
  verifyForgotKey,
  verifyRegistrationKey,
} from '~/api';
import confetti from '~/assets/lotties/confetti.json';
import { Button, IconButton, Input, TranslatedText } from '~/bits';
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
  const navigate = useNavigate();
  const { email, key } = useParams();
  const { control, handleSubmit, setError } = useForm<SecondStepInputs>({
    defaultValues: {
      email: email ?? '',
      password: '',
      confirmPassword: '',
    },
  });

  if (!email || !key) {
    return <Navigate to="/" />;
  }

  const queryFn =
    type === 'signUp'
      ? () => verifyRegistrationKey({ email, key })
      : () => verifyForgotKey({ email, key });

  const url = type === 'signUp' ? '/sign-up' : '/forgot';
  const initQuery = useQuery({
    retry: 0,
    queryKey: [type, email, key],
    queryFn,
  });

  const mutationFn = type === 'signUp' ? createUser : updateUser;
  const mutation = useMutation({ mutationFn });

  useEffect(() => {
    if (initQuery.error) {
      generateOnError({ fn: () => navigate(url) });
    }
  }, [initQuery.error]);

  if (initQuery.isLoading) {
    return <CircularProgress />;
  }

  const onSubmit = (data: SecondStepInputs) => {
    if (data.password !== data.confirmPassword) {
      setError('confirmPassword', { message: 'passwordsDoNotMatch' });
      return;
    }

    const preparedData = { email, key, password: data.password };

    mutation.mutate(preparedData, {
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
  };

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
          <TranslatedText variant="h5" textKey="justOneMoreStep" />
          <TranslatedText
            variant="subtitle2"
            color="text.secondary"
            textKey="enterYourDetails"
          />
        </Box>
        <IconButton open={true} titleKey="goBack" onClick={() => navigate('/')}>
          <ArrowBackIosNewIcon />
        </IconButton>
      </Stack>
      <Input name="email" labelKey="email" control={control} disabled={true} />
      <Input
        name="password"
        labelKey={passwordInput}
        control={control}
        type="password"
        rules={{ minLength: 8 }}
      />
      <Input
        name="confirmPassword"
        labelKey="confirmPassword"
        control={control}
        type="password"
        rules={{ minLength: 8 }}
      />
      <Button
        type="submit"
        textKey="continue"
        variant="contained"
        loading={mutation.isPending}
      />
      <Stepper activeStep={2} />
    </Stack>
  );
};

const ThirdStep = ({ type }: Props) => {
  const navigate = useNavigate();

  const passwordInput =
    type === 'signUp'
      ? 'successfullyRegistered'
      : 'passwordChangedSuccessfully';

  return (
    <Stack width={1} spacing={2.5} maxWidth={500} position="relative">
      <Box>
        <TranslatedText variant="h5" textKey={passwordInput} />
        <TranslatedText
          variant="subtitle2"
          color="text.secondary"
          textKey="letsDoShopping"
        />
      </Box>
      <Button
        textKey="logIn"
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
