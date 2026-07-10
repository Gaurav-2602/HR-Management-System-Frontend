import React, { useState, useEffect } from 'react';
import { RefreshCw, Users, GraduationCap, ClipboardCheck, AlertCircle } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import ErrorMessage from '../../components/common/ErrorMessage';

// Dashboard components
import AdminMetricCard from '../../components/dashboard/admin/AdminMetricCard';
import InternStatusOverview from '../../components/dashboard/admin/InternStatusOverview';
import AssignmentMetrics from '../../components/dashboard/admin/AssignmentMetrics';
import MonthlyRegistrationsChart from '../../components/dashboard/admin/MonthlyRegistrationsChart';
import BreakdownCard from '../../components/dashboard/admin/BreakdownCard';
import RecentActivity from '../../components/dashboard/admin/RecentActivity';

// API Service
import { dashboardService } from '../../services/dashboard';

/**
 * AdminDashboardPage component. Composes the overall metrics layout.
 */
export default function AdminDashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [refreshError, setRefreshError] = useState('');

  // Fetch admin dashboard dataset
  const fetchDashboardData = async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setRefreshing(true);
      setRefreshError('');
    } else {
      setLoading(true);
      setErrorMsg('');
    }

    try {
      const response = await dashboardService.getAdminDashboard();
      if (response && response.success) {
        setData(response);
      } else {
        throw new Error(response?.error || 'Failed to retrieve dashboard data');
      }
    } catch (err) {
      console.error('Error fetching dashboard dataset:', err);
      const message = err.response?.data?.error || err.response?.data?.message || 'A network error occurred. Please verify your connection.';
      
      if (isManualRefresh) {
        setRefreshError(`Failed to update data: ${message}`);
      } else {
        setErrorMsg(message);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData(false);
  }, []);

  const handleRefresh = () => {
    fetchDashboardData(true);
  };

  // 1. Initial Load - Show large centered spinner
  if (loading && !data) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner size="lg" label="Loading dashboard analytics..." />
      </div>
    );
  }

  // 2. Initial Load Fail - Show full page error message with retry boundary
  if (errorMsg && !data) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center p-4">
        <ErrorMessage
          title="Dashboard loading failed"
          message={errorMsg}
          onRetry={() => fetchDashboardData(false)}
        />
      </div>
    );
  }

  // Fallback when data is empty
  const stats = data?.stats || {};
  const breakdowns = data?.breakdowns || {};
  const recentActivity = data?.recentActivity || {};

  return (
    <div className="flex flex-col gap-6">
      {/* Header with dynamic refresh indicator */}
      <PageHeader
        title="Dashboard"
        description="Overview of your internship and training operations."
        action={
          <Button
            variant="secondary"
            icon={RefreshCw}
            loading={refreshing}
            disabled={refreshing}
            onClick={handleRefresh}
          >
            {refreshing ? 'Updating...' : 'Refresh'}
          </Button>
        }
      />

      {/* Non-destructive Refresh Error Banner */}
      {refreshError && (
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg flex items-center justify-between text-xs font-semibold shadow-xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
            <span>{refreshError}</span>
          </div>
          <button
            onClick={() => setRefreshError('')}
            className="text-red-500 hover:text-red-800 font-bold focus:outline-none"
            aria-label="Dismiss message"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 1. Metric Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AdminMetricCard
          label="Total Active Interns"
          value={stats.interns?.totalActive}
          icon={GraduationCap}
        />
        <AdminMetricCard
          label="Total Active Mentors"
          value={stats.mentors?.totalActive}
          icon={Users}
        />
        <AdminMetricCard
          label="Pending Evaluations"
          value={stats.assignments?.pendingCurrent}
          icon={ClipboardCheck}
        />
      </div>

      {/* 2. Main Analytics Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column (Chart & Activity) */}
        <div className="lg:col-span-2 flex flex-col gap-6 w-full">
          <MonthlyRegistrationsChart data={breakdowns.monthlyRegistrations} />
          <RecentActivity
            recentRegistrations={recentActivity.recentRegistrations}
            recentAssignments={recentActivity.recentAssignments}
            recentCertificates={recentActivity.recentCertificates}
          />
        </div>

        {/* Right Column (Status Breakdown & Performance) */}
        <div className="lg:col-span-1 flex flex-col gap-6 w-full">
          <InternStatusOverview byStatus={stats.interns?.byStatus} />
          <AssignmentMetrics
            pendingCurrent={stats.assignments?.pendingCurrent}
            acceptedAllTime={stats.assignments?.acceptedAllTime}
            rejectedAllTime={stats.assignments?.rejectedAllTime}
          />
        </div>
      </div>

      {/* 3. Program Demographics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <BreakdownCard
          title="Training Type"
          subtitle="Registrations divided by course path"
          items={breakdowns.byTrainingType}
          labelKey="trainingType"
        />
        <BreakdownCard
          title="Division Distribution"
          subtitle="Active candidates placed by division"
          items={breakdowns.byDivision}
          labelKey="division"
        />
        <BreakdownCard
          title="Institute Distribution"
          subtitle="Top contributing universities"
          items={breakdowns.byInstitute}
          labelKey="instituteName"
        />
      </div>
    </div>
  );
}
