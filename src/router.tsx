import { QueryClient } from '@tanstack/react-query';
import { createBrowserRouter } from 'react-router-dom';
import { ErrorPage, LogInPage, signUpPage } from './pages';
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
              element: <signUpPage.SignUpFirstPage />,
            },
            {
              path: ':email/:key',
              element: <signUpPage.SignUpSecondPage />,
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
