import Lottie from 'lottie-react';
import error from '~/assets/lotties/error.json';

export const ErrorPage = () => {
  return <Lottie animationData={error} loop={true} />;
};
