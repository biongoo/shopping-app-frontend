import create from 'zustand';

type Auth = {
  accessToken?: string;
  refreshToken?: string;
  logIn: (
    type: 'local' | 'session',
    accessToken: string,
    refreshToken: string
  ) => void;
  logOut: () => void;
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
    removeFromStorages('accessToken');
    removeFromStorages('refreshToken');

    set(() => ({ accessToken: undefined, refreshToken: undefined }));
  },
}));
