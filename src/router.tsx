import { createBrowserRouter } from 'react-router-dom';
import { ErrorPage, LogInPage, SignUpPage } from './pages';
import { AuthLayout } from './partials';

export function loader() {
  console.log('login');
}

export function loader3() {
  console.log('signUp');
}

export function loader2() {
  console.log('parent');
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthLayout />,
    loader: loader2,
    children: [
      {
        path: '/',
        element: <LogInPage />,
        loader: loader,
      },
      {
        path: 'sign-up',
        element: <SignUpPage />,
        loader: loader3,
      },
    ],
  },
  {
    path: '*',
    element: <ErrorPage />,
  },
]);
