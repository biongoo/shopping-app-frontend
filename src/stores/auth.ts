import { create } from 'zustand';
import { queryClient } from '~/main';

type Auth = {
  accessToken?: string;
  refreshToken?: string;
  isRefreshing: boolean;
  logIn: (
    type: 'local' | 'session',
    accessToken: string,
    refreshToken: string
  ) => void;
  logOut: () => void;
  refreshTokens: (accessToken: string, refreshToken: string) => void;
};

const getStorage = <T>(key: string) => {
  const value = localStorage.getItem(key) || sessionStorage.getItem(key);
  return value ? (JSON.parse(value) as T) : undefined;
};

const setStorage = <T>(type: 'local' | 'session', key: string, value: T) => {
  if (type === 'local') {
    localStorage.setItem(key, JSON.stringify(value));
  } else {
    sessionStorage.setItem(key, JSON.stringify(value));
  }
};

const removeFromStorages = (key: string) => {
  localStorage.removeItem(key);
  sessionStorage.removeItem(key);
};

export const useAuthStore = create<Auth>()((set) => ({
  accessToken: getStorage('accessToken'),

  refreshToken: getStorage('refreshToken'),

  isRefreshing: false,

  logIn: (
    type: 'local' | 'session',
    accessToken: string,
    refreshToken: string
  ) => {
    setStorage(type, 'accessToken', accessToken);
    setStorage(type, 'refreshToken', refreshToken);

    set(() => ({ accessToken, refreshToken }));
  },

  logOut: () => {
    set(() => ({ accessToken: undefined, refreshToken: undefined }));

    removeFromStorages('accessToken');
    removeFromStorages('refreshToken');
    queryClient.removeQueries();
  },

  refreshTokens: (accessToken: string, refreshToken: string) => {
    const type = localStorage.getItem('accessToken') ? 'local' : 'session';

    setStorage(type, 'accessToken', accessToken);
    setStorage(type, 'refreshToken', refreshToken);

    set(() => ({ accessToken, refreshToken }));
  },
}));
