import { Box, Paper } from '@mui/material';
import { Stack } from '@mui/system';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { changePassword } from '~/api';
import { Breadcrumbs, Button, Input, TranslatedText } from '~/bits';
import { useAuthStore } from '~/stores';
import { generateOnError, generateOnSuccess } from '~/utils';
import { DeleteAccount } from './components';

const breadcrumbs = [{ key: 'home' }, { key: 'settings' }];

type ChangePasswordInputs = {
  password: string;
  oldPassword: string;
  confirmPassword: string;
};

export const SettingsPage = () => {
  const mutation = useMutation(changePassword);
  const logOut = useAuthStore((store) => store.logOut);
  const { control, handleSubmit, setError } = useForm<ChangePasswordInputs>({
    defaultValues: {
      password: '',
      oldPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (data: ChangePasswordInputs) => {
    if (data.password !== data.confirmPassword) {
      setError('confirmPassword', { message: 'passwordsDoNotMatch' });
      return;
    }

    const preparedData = {
      password: data.password,
      oldPassword: data.oldPassword,
    };

    mutation.mutate(preparedData, {
      onSuccess: generateOnSuccess({
        message: 'successfullyEdited',
        fn: logOut,
      }),
      onError: generateOnError({ setError }),
    });
  };

  return (
    <Stack
      sx={{
        flexGrow: 1,
        overflow: 'hidden',
      }}
    >
      <Box mb={4}>
        <TranslatedText textKey="settings" variant="h5" gutterBottom />
        <Breadcrumbs elements={breadcrumbs} />
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Stack
          component={Paper}
          sx={{
            px: 2,
            pt: 1.5,
            pb: 2,
            backgroundImage: 'none',
            maxWidth: 600,
            width: 1,
          }}
          spacing={2}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <TranslatedText textKey="changePassword" variant="h6" />
            <DeleteAccount />
          </Stack>
          <Input
            name="oldPassword"
            labelKey="oldPassword"
            control={control}
            type="password"
            rules={{ minLength: 8 }}
          />
          <Input
            name="password"
            labelKey="newPassword"
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
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type="submit"
              textKey="save"
              variant="contained"
              fullWidth={false}
              loading={mutation.isLoading}
            />
          </Box>
        </Stack>
      </Box>
    </Stack>
  );
};
