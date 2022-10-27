import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { SignUpFirstStep } from './steps';

export const SignUpPage = () => {
  const [step, setStep] = useState(1);

  const goNextStep = () => {
    setStep((x) => x + 1);
  };

  switch (step) {
    case 1: {
      return <SignUpFirstStep />;
    }
    case 2: {
      return <h1>dwa</h1>;
    }
    case 3: {
      return <h1>trzy</h1>;
    }
    default: {
      return <Navigate to="/404" />;
    }
  }
};
