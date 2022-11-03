import { connectApi } from './connect-api';

export const createRegistrationUser = (data: { email: string }) => {
  return connectApi({
    endpoint: 'sign-up/first-step',
    method: 'POST',
    body: { email: data.email },
  });
};
