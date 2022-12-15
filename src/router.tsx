import { createBrowserRouter, Navigate, useLocation } from 'react-router-dom';
import {
  ErrorPage,
  ForgotPage,
  HomePage,
  ListPage,
  LogInPage,
  ProductPage,
  SectionPage,
  SectionProductPage,
  ShopPage,
  SignUpPage,
} from './pages';
import { AppLayout, AuthLayout } from './partials';
import { useAuthStore } from './stores';

type AuthProviderProps = {
  shouldBeLoggedIn: boolean;
  children: JSX.Element;
};

const AuthProvider = (props: AuthProviderProps) => {
  const location = useLocation();
  const refreshToken = useAuthStore((store) => store.refreshToken);

  if (props.shouldBeLoggedIn) {
    if (!refreshToken) {
      return <Navigate to="/" state={{ from: location }} replace />;
    }
  } else {
    if (refreshToken) {
      return <Navigate to="/app/home" state={{ from: location }} replace />;
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
    children: [
      {
        index: true,
        element: <Navigate to="/app/home" />,
      },
      {
        path: 'home',
        children: [
          {
            index: true,
            element: <HomePage />,
          },
          {
            path: ':listId',
            element: <ListPage />,
          },
        ],
      },
      {
        path: 'shop',
        children: [
          {
            index: true,
            element: <ShopPage />,
          },
          {
            path: ':shopId',
            children: [
              {
                index: true,
                element: <SectionPage />,
              },
              {
                path: ':sectionId',
                element: <SectionProductPage />,
              },
            ],
          },
        ],
      },
      {
        path: 'product',
        element: <ProductPage />,
      },
    ],
  },
  {
    path: '*',
    element: <ErrorPage />,
  },
]);
