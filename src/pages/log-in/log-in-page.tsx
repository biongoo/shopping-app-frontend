import { Link } from 'react-router-dom';

export const LogInPage = () => {
  return (
    <div>
      Login page <Link to="/test">Test fail</Link>
      <Link to="/sign-in">Sign in</Link>
    </div>
  );
};
