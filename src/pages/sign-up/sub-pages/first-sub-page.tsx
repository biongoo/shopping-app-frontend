import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { Box, Stack } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { createForgotUser, createRegistrationUser } from '~/api';
import { Button, IconButton, Input, TranslatedText } from '~/bits';
import { generateOnError, generateOnSuccess } from '~/utils';
import { Stepper } from '../components/stepper';

type Props = {
  type: 'signUp' | 'forgot';
};

type FirstSubInputs = {
  email: string;
};

export const FirstSubPage = ({ type }: Props) => {
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: type === 'signUp' ? createRegistrationUser : createForgotUser,
  });
  const { control, handleSubmit, setError, reset } = useForm<FirstSubInputs>({
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = (data: FirstSubInputs) => {
    mutation.mutate(data, {
      onSuccess: generateOnSuccess({ reset }),
      onError: generateOnError({ setError }),
    });
  };

  const title =
    type === 'signUp' ? 'getStartedAbsolutelyFree' : 'resetYourPassword';

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
          <TranslatedText variant="h5" textKey={title} />
          <TranslatedText
            variant="subtitle2"
            color="text.secondary"
            textKey={'enterYourDetails'}
          />
        </Box>
        <IconButton open={true} titleKey="goBack" onClick={() => navigate('/')}>
          <ArrowBackIosNewIcon />
        </IconButton>
      </Stack>
      <Input
        name="email"
        labelKey="email"
        control={control}
        patternErrorMessage="invalidEmail"
        rules={{
          pattern:
            // eslint-disable-next-line unicorn/better-regex
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        }}
      />
      <Button
        type="submit"
        textKey="continue"
        variant="contained"
        loading={mutation.isPending}
      />
      <Stepper activeStep={1} />
    </Stack>
  );
};
