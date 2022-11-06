import { Navigate } from 'react-router-dom';
import { FirstSubPage, SecondSubPage } from './sub-pages';

type Props = {
  step: 1 | 2;
};

export const SignUpPage = (props: Props) => {
  switch (props.step) {
    case 1: {
      return <FirstSubPage type="signUp" />;
    }
    case 2: {
      return <SecondSubPage type="signUp" />;
    }
    default: {
      return <Navigate to="/" />;
    }
  }
};
