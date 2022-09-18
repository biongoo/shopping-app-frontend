import { useRouteError, isRouteErrorResponse } from 'react-router-dom';

export const ErrorPage = () => {
  const error = useRouteError();

  if (!isRouteErrorResponse(error)) {
    return <div>Oops</div>;
  }

  console.log(error);

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error?.statusText}</i>
      </p>
    </div>
  );
};
