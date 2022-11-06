import { connectApi } from './connect-api';

type AuthReqDto = {
  email: string;
  password: string;
};

type AuthResDto = {
  accessToken: string;
  refreshToken: string;
};

export const logIn = (body: AuthReqDto) =>
  connectApi<AuthReqDto, AuthResDto>({
    endpoint: 'auth/log-in',
    method: 'POST',
    body,
  });
