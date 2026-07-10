import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import LoginPage from '../pages/auth/LoginPage';
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import MentorsPage from '../pages/admin/MentorsPage';
import InternsPage from '../pages/admin/InternsPage';
import AdminAssignmentsPage from '../pages/admin/AssignmentsPage';
import CertificatesPage from '../pages/admin/CertificatesPage';
import MentorDashboardPage from '../pages/mentor/MentorDashboardPage';
import MentorAssignmentsPage from '../pages/mentor/AssignmentsPage';
import OngoingInternsPage from '../pages/mentor/OngoingInternsPage';
import NotFoundPage from '../pages/NotFoundPage';
import ProtectedRoute from '../components/common/ProtectedRoute';
import PublicRoute from '../components/common/PublicRoute';
import AppLayout from '../layouts/AppLayout';
import Spinner from '../components/common/Spinner';

/**
 * Helper component to handle dynamic root "/" navigation based on auth state
 */
function RootIndexRedirect() {
  const { user, isAuthenticated, isInitializing } = useAuth();

  if (isInitializing) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-50">
        <Spinner size="lg" label="Loading..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === 'HR_ADMIN') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (user.role === 'MENTOR') {
    return <Navigate to="/mentor/dashboard" replace />;
  }

  return <Navigate to="/login" replace />;
}

/**
 * Centrally defined application routes with guards and layouts
 */
export default function AppRoutes() {
  return (
    <Routes>
      {/* Root redirect handler */}
      <Route path="/" element={<RootIndexRedirect />} />
      
      {/* Public routes only (redirects to dashboard if logged in) */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>
      
      {/* Protected HR Admin Routes under AppLayout */}
      <Route element={<ProtectedRoute allowedRoles={['HR_ADMIN']} />}>
        <Route element={<AppLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/mentors" element={<MentorsPage />} />
          <Route path="/admin/interns" element={<InternsPage />} />
          <Route path="/admin/assignments" element={<AdminAssignmentsPage />} />
          <Route path="/admin/certificates" element={<CertificatesPage />} />
        </Route>
      </Route>
      
      {/* Protected Mentor Routes under AppLayout */}
      <Route element={<ProtectedRoute allowedRoles={['MENTOR']} />}>
        <Route element={<AppLayout />}>
          <Route path="/mentor/dashboard" element={<MentorDashboardPage />} />
          <Route path="/mentor/assignments" element={<MentorAssignmentsPage />} />
          <Route path="/mentor/interns" element={<OngoingInternsPage />} />
        </Route>
      </Route>
      
      {/* Wildcard 404 route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
