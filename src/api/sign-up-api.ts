import { connectApi } from './connect-api';

type FirstStepDto = {
  email: string;
};

type SecondStepDto = {
  email: string;
  key: string;
};

type ThirdStepDto = {
  password: string;
  email: string;
  key: string;
};

export const createRegistrationUser = (body: FirstStepDto) =>
  connectApi({
    endpoint: 'auth/sign-up/first-step',
    method: 'POST',
    body,
  });

export const verifyRegistrationKey = (body: SecondStepDto) =>
  connectApi({
    endpoint: 'auth/sign-up/second-step',
    method: 'POST',
    body,
  });

export const createUser = (body: ThirdStepDto) =>
  connectApi({
    endpoint: 'auth/sign-up/third-step',
    method: 'POST',
    body,
  });

export const createForgotUser = (body: FirstStepDto) =>
  connectApi({
    endpoint: 'auth/forgot/first-step',
    method: 'POST',
    body,
  });

export const verifyForgotKey = (body: SecondStepDto) =>
  connectApi({
    endpoint: 'auth/forgot/second-step',
    method: 'POST',
    body,
  });

export const updateUser = (body: ThirdStepDto) =>
  connectApi({
    endpoint: 'auth/forgot/third-step',
    method: 'POST',
    body,
  });
