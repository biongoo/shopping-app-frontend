import create from 'zustand';

type Auth = {
  accessToken?: string;
  refreshToken?: string;
  logIn: (
    type: 'local' | 'session',
    accessToken: string,
    refreshToken: string
  ) => void;
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

export const useAuthStore = create<Auth>()((set) => ({
  accessToken: getStorage('accessToken'),

  refreshToken: getStorage('refreshToken'),

  logIn: (
    type: 'local' | 'session',
    accessToken: string,
    refreshToken: string
  ) => {
    set(() => {
      setStorage(type, 'accessToken', accessToken);
      setStorage(type, 'refreshToken', refreshToken);
      return { accessToken, refreshToken };
    });
  },
}));
