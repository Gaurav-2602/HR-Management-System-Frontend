import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Spinner from './Spinner';

/**
 * Route guard for pages requiring authentication
 */
export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, isAuthenticated, isInitializing } = useAuth();

  // Show full screen spinner while restoring session
  if (isInitializing) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Spinner size="lg" label="Restoring session..." />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Role authorization check
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect authorized users trying to access unauthorized roles back to their proper dashboard
    if (user.role === 'HR_ADMIN') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    if (user.role === 'MENTOR') {
      return <Navigate to="/mentor/dashboard" replace />;
    }
    // Fallback if role is unrecognized
    return <Navigate to="/login" replace />;
  }

  return children ? children : <Outlet />;
}
