import { Navigate } from 'react-router-dom';
import { SignUpFirstStep } from './steps';

export const SignUpPage = () => {
  let step = 1;

  switch (step) {
    case 1: {
      return <SignUpFirstStep />;
    }
    case 2: {
      return <h1>jeden</h1>;
    }
    case 3: {
      return <h1>jeden</h1>;
    }
    default: {
      return <Navigate to="/404" />;
    }
  }
  step += 1;
};
