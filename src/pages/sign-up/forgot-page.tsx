import { Navigate } from 'react-router-dom';
import { FirstSubPage, SecondSubPage } from './sub-pages';

type Props = {
  step: 1 | 2;
};

export const ForgotPage = (props: Props) => {
  switch (props.step) {
    case 1: {
      return <FirstSubPage type="forgot" />;
    }
    case 2: {
      return <SecondSubPage type="forgot" />;
    }
    default: {
      return <Navigate to="/" />;
    }
  }
};
