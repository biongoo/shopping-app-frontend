import { connectApi } from './connect-api';

type SignUpFirstStepDto = {
  email: string;
};

type SignUpSecondStepDto = {
  email: string;
  key: string;
};

type SignUpThirdStepDto = {
  password: string;
  email: string;
  key: string;
};

export const createRegistrationUser = (body: SignUpFirstStepDto) =>
  connectApi({
    endpoint: 'auth/sign-up/first-step',
    method: 'POST',
    body,
  });

export const verifyRegistrationKey = (body: SignUpSecondStepDto) =>
  connectApi({
    endpoint: 'auth/sign-up/second-step',
    method: 'POST',
    body,
  });

export const createUser = (body: SignUpThirdStepDto) =>
  connectApi({
    endpoint: 'auth/sign-up/third-step',
    method: 'POST',
    body,
  });
