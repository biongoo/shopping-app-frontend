type ConnectApiProps<T> = Omit<RequestInit, 'url' | 'body'> & {
  endpoint: string;
  body?: T;
};

export const connectApi = async <T>(props: ConnectApiProps<T>) => {
  const response = await fetch(`/api/${props.endpoint}`, {
    method: props.method ?? 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...props.headers,
      /* Authorization: `Bearer ${store.getState().auth.accessToken}`, */
    },
    body: props.body ? JSON.stringify(props.body) : undefined,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message ?? 'Unexpected error occurred.');
  }

  return data;
};
