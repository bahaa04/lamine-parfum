import { Navigate, Outlet } from 'react-router-dom';
import { useAdminAuthStore } from '../../context/adminAuthStore';
import { useEffect } from 'react';

export default function AdminProtectedRoute() {
  const isAuthenticated = useAdminAuthStore(state => state.isAuthenticated);
  const checkSession = useAdminAuthStore(state => state.checkSession);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  if (!isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
}
