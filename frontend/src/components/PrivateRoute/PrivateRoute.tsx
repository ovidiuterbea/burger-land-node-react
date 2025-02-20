import { JSX } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { loggedIn } = useAuth();
  if (!loggedIn) return <Navigate to="/auth" replace />;
  return children;
};

export default PrivateRoute;
