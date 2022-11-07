import { createBrowserRouter, Navigate, useLocation } from 'react-router-dom';
import { ErrorPage, LogInPage, SignUpPage } from './pages';
import { ForgotPage } from './pages/sign-up/forgot-page';
import { AppLayout, AuthLayout } from './partials';
import { useAuthStore } from './stores';

type AuthProviderProps = {
  shouldBeLoggedIn: boolean;
  children: JSX.Element;
};

const AuthProvider = (props: AuthProviderProps) => {
  const accessToken = useAuthStore((store) => store.accessToken);
  const location = useLocation();

  if (props.shouldBeLoggedIn) {
    if (!accessToken) {
      return <Navigate to="/" state={{ from: location }} replace />;
    }
  } else {
    if (accessToken) {
      return <Navigate to="/app" state={{ from: location }} replace />;
    }
  }

  return props.children;
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <AuthProvider shouldBeLoggedIn={false}>
        <AuthLayout />
      </AuthProvider>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <LogInPage />,
      },
      {
        path: 'sign-up',
        children: [
          {
            index: true,
            element: <SignUpPage step={1} />,
          },
          {
            path: ':email/:key',
            element: <SignUpPage step={2} />,
          },
        ],
      },
      {
        path: 'forgot',
        children: [
          {
            index: true,
            element: <ForgotPage step={1} />,
          },
          {
            path: ':email/:key',
            element: <ForgotPage step={2} />,
          },
        ],
      },
    ],
  },
  {
    path: '/app',
    element: (
      <AuthProvider shouldBeLoggedIn={true}>
        <AppLayout />
      </AuthProvider>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '*',
    element: <ErrorPage />,
  },
]);
