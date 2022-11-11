import jwtDecode from 'jwt-decode';
import { ApiData, ApiError } from '~/models';
import { useAuthStore } from '~/stores';
import { Jwt } from '~/types';
import { refreshTokens } from './auth-api';

type ConnectApiProps<Req> = Omit<RequestInit, 'url' | 'body'> & {
  endpoint: string;
  tokenType?: 'access' | 'refresh' | false;
  omitCheckTokens?: boolean;
  body?: Req;
};

export const connectApi = async <Res = unknown, Req = unknown>(
  props: ConnectApiProps<Req>
) => {
  try {
    if (props.tokenType != false && props.omitCheckTokens != true) {
      await checkTokens();
    }

    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}${props.endpoint}`,
      {
        method: props.method ?? 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(props.tokenType != false && {
            Authorization: `Bearer ${
              props.tokenType === 'refresh'
                ? useAuthStore.getState().refreshToken
                : useAuthStore.getState().accessToken
            }`,
          }),
          ...props.headers,
        },
        body: props.body ? JSON.stringify(props.body) : undefined,
      }
    );

    const { status, data, message, error } = await response.json();

    if (!response.ok) {
      if (
        Array.isArray(message) &&
        message.every((x): x is string => typeof x === 'string')
      ) {
        throw new ApiError(error, message);
      } else if (typeof message === 'string') {
        throw new ApiError(message);
      } else {
        throw new ApiError('unknownApiError');
      }
    }

    return new ApiData(status, data as Res, message);
  } catch (error) {
    throw error instanceof ApiError ? error : new ApiError('unknownApiError');
  }
};

const checkTokens = async () => {
  const { accessToken, refreshToken } = useAuthStore.getState();

  if (!accessToken || !refreshToken) {
    return logOutFn();
  }

  const refreshExp = jwtDecode<Jwt>(refreshToken).exp;
  if (refreshExp * 1000 <= Date.now()) {
    return logOutFn();
  }

  const accessExp = jwtDecode<Jwt>(accessToken).exp;
  if ((accessExp - 60) * 1000 <= Date.now() && !(await tryRefreshToken())) {
    return logOutFn();
  }
};

const tryRefreshToken = async () => {
  try {
    const response = await refreshTokens();

    if (!response) {
      return false;
    }

    const { accessToken, refreshToken } = response.data;
    useAuthStore.getState().refreshTokens(accessToken, refreshToken);

    return true;
  } catch {
    return false;
  }
};

const logOutFn = () => {
  useAuthStore.getState().logOut();
  throw new ApiError('invalidCredentials');
};
