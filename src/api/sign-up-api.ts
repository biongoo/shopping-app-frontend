import { ApiData } from '~/models';
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

export const createRegistrationUser = (body: FirstStepDto): Promise<ApiData> =>
  connectApi({
    endpoint: 'auth/sign-up/first-step',
    tokenType: false,
    method: 'POST',
    body,
  });

export const verifyRegistrationKey = (body: SecondStepDto): Promise<ApiData> =>
  connectApi({
    endpoint: 'auth/sign-up/second-step',
    tokenType: false,
    method: 'POST',
    body,
  });

export const createUser = (body: ThirdStepDto): Promise<ApiData> =>
  connectApi({
    endpoint: 'auth/sign-up/third-step',
    tokenType: false,
    method: 'POST',
    body,
  });

export const createForgotUser = (body: FirstStepDto): Promise<ApiData> =>
  connectApi({
    endpoint: 'auth/forgot/first-step',
    tokenType: false,
    method: 'POST',
    body,
  });

export const verifyForgotKey = (body: SecondStepDto): Promise<ApiData> =>
  connectApi({
    endpoint: 'auth/forgot/second-step',
    tokenType: false,
    method: 'POST',
    body,
  });

export const updateUser = (body: ThirdStepDto): Promise<ApiData> =>
  connectApi({
    endpoint: 'auth/forgot/third-step',
    tokenType: false,
    method: 'POST',
    body,
  });
