import { ApiData, ApiError } from '~/models';

type ConnectApiProps<Req> = Omit<RequestInit, 'url' | 'body'> & {
  endpoint: string;
  body?: Req;
};

export const connectApi = async <Req, Res = never>(
  props: ConnectApiProps<Req>
) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}${props.endpoint}`,
      {
        method: props.method ?? 'GET',
        headers: {
          'Content-Type': 'application/json',
          /* Authorization: `Bearer ${store.getState().auth.accessToken}`, */
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

    return new ApiData(status, message, data as Res);
  } catch (error) {
    throw error instanceof ApiError ? error : new ApiError('unknownApiError');
  }
};
