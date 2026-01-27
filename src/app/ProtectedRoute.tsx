import { Navigate, useLocation } from 'react-router-dom';
import { getAccessToken } from '@app/api';

type Props = {
  children: JSX.Element;
};

export default function ProtectedRoute({ children }: Props) {
  const location = useLocation();
  const token = getAccessToken();
  const user = localStorage.getItem('vtai_user');

  if (!token && !user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
