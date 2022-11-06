import { QueryClient } from '@tanstack/react-query';
import { createBrowserRouter } from 'react-router-dom';
import { ErrorPage, LogInPage, SignUpPage } from './pages';
import { ForgotPage } from './pages/sign-up/forgot-page';
import { AuthLayout } from './partials';

export const router = (queryClient: QueryClient) =>
  createBrowserRouter([
    {
      path: '/',
      element: <AuthLayout />,
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
      path: '*',
      element: <ErrorPage />,
    },
  ]);
