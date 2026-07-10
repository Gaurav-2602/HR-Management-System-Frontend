import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Spinner from './Spinner';

/**
 * Route wrapper for pages that are only accessible by unauthenticated users (e.g. login)
 */
export default function PublicRoute({ children }) {
  const { user, isAuthenticated, isInitializing } = useAuth();

  // Show full screen spinner while restoring session
  if (isInitializing) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Spinner size="lg" label="Checking authentication..." />
      </div>
    );
  }

  // Redirect authenticated users to their corresponding dashboard
  if (isAuthenticated) {
    if (user.role === 'HR_ADMIN') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    if (user.role === 'MENTOR') {
      return <Navigate to="/mentor/dashboard" replace />;
    }
  }

  return children ? children : <Outlet />;
}
