import { createBrowserRouter } from 'react-router-dom';
import { ErrorPage } from './pages';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <div>Hello world!</div>,
  },
  {
    path: '*',
    element: <ErrorPage />,
  },
]);
