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
    tokenType: false,
    method: 'POST',
    body,
  });

export const logOut = () =>
  connectApi({
    endpoint: 'auth/log-out',
    tokenType: 'refresh',
    method: 'POST',
  });

export const refreshTokens = () =>
  connectApi<never, AuthResDto>({
    endpoint: 'auth/refresh',
    tokenType: 'refresh',
    method: 'POST',
    omitCheckTokens: true,
  });
