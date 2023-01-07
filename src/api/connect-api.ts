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
      if (response.status === 401) {
        await checkTokens(true);
      }

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

const checkTokens = async (hardRefresh?: boolean) => {
  const { accessToken, refreshToken } = useAuthStore.getState();

  if (!refreshToken || jwtDecode<Jwt>(refreshToken).exp * 1000 <= Date.now()) {
    logOutFn();
  }

  if (
    !accessToken ||
    (jwtDecode<Jwt>(accessToken).exp - 10) * 1000 <= Date.now() ||
    hardRefresh
  ) {
    await tryRefreshToken();
  }
};

const tryRefreshToken = async () => {
  if (useAuthStore.getState().isRefreshing) {
    throw new ApiError('refreshingNow');
  }

  useAuthStore.setState({ isRefreshing: true });

  try {
    const response = await refreshTokens();

    if (response.status != 'ok' || !useAuthStore.getState().refreshToken) {
      throw new Error('invalidCredentials');
    }

    const { accessToken, refreshToken } = response.data;

    useAuthStore.getState().refreshTokens(accessToken, refreshToken);
    useAuthStore.setState({ isRefreshing: false });
  } catch {
    useAuthStore.setState({ isRefreshing: false });
    logOutFn();
  }
};

const logOutFn = () => {
  useAuthStore.getState().logOut();
  throw new ApiError('invalidCredentials');
};
