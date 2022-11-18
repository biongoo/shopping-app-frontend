import { ApiData } from '~/models';
import { connectApi } from './connect-api';

type AuthReqDto = {
  email: string;
  password: string;
};

type AuthResDto = {
  accessToken: string;
  refreshToken: string;
};

export const logIn = (body: AuthReqDto): Promise<ApiData<AuthResDto>> =>
  connectApi({
    endpoint: 'auth/log-in',
    tokenType: false,
    method: 'POST',
    body,
  });

export const logOut = (): Promise<ApiData> =>
  connectApi({
    endpoint: 'auth/log-out',
    tokenType: 'refresh',
    method: 'POST',
  });

export const refreshTokens = (): Promise<ApiData<AuthResDto>> =>
  connectApi({
    endpoint: 'auth/refresh',
    tokenType: 'refresh',
    method: 'POST',
    omitCheckTokens: true,
  });
