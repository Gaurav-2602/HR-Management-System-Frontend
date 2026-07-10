import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  RefreshCw,
  GraduationCap,
  ClipboardCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Award,
  Users
} from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';
import Badge from '../../components/common/Badge';

// Utils / Services
import { dashboardService } from '../../services/dashboard';
import { getAssignmentStatusLabel, getAssignmentStatusVariant } from '../../utils/status';
import { formatDate } from '../../utils/dashboard';

/**
 * Metric Card specifically styled for Mentor Dashboard
 */
function MentorMetricCard({ label, value, icon: Icon }) {
  const displayValue = typeof value === 'number' ? value : 0;
  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex items-center justify-between gap-4 select-none">
      <div className="flex flex-col gap-1 text-left">
        <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{label}</span>
        <span className="text-2xl font-bold text-gray-900 dark:text-white leading-tight mt-0.5">{displayValue}</span>
      </div>
      {Icon && (
        <div className="p-3 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 rounded-xl shrink-0">
          <Icon className="h-5.5 w-5.5" />
        </div>
      )}
    </div>
  );
}

/**
 * MentorDashboardPage - Operational interface for assigned Mentors
 */
export default function MentorDashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [refreshError, setRefreshError] = useState('');

  const fetchDashboardData = async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setRefreshing(true);
      setRefreshError('');
    } else {
      setLoading(true);
      setErrorMsg('');
    }

    try {
      const response = await dashboardService.getMentorDashboard();
      if (response && response.success) {
        setData(response);
      } else {
        throw new Error(response?.error || 'Failed to retrieve dashboard data');
      }
    } catch (err) {
      console.error('Error fetching mentor dashboard:', err);
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

  // 1. Loading State
  if (loading && !data) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner size="lg" label="Loading mentor overview board..." />
      </div>
    );
  }

  // 2. Error State
  if (errorMsg && !data) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center p-4">
        <ErrorMessage
          title="Failed to load dashboard"
          message={errorMsg}
          onRetry={() => fetchDashboardData(false)}
        />
      </div>
    );
  }

  const stats = data?.stats || {};
  const recentActivity = data?.recentActivity || {};

  const totalAssignments = (stats.assignments?.pendingCurrent || 0) + (stats.assignments?.acceptedAllTime || 0) + (stats.assignments?.rejectedAllTime || 0);
  const pendingPct = totalAssignments > 0 ? Math.round(((stats.assignments?.pendingCurrent || 0) / totalAssignments) * 100) : 0;
  const acceptedPct = totalAssignments > 0 ? Math.round(((stats.assignments?.acceptedAllTime || 0) / totalAssignments) * 100) : 0;
  const rejectedPct = totalAssignments > 0 ? Math.round(((stats.assignments?.rejectedAllTime || 0) / totalAssignments) * 100) : 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <PageHeader
        title="Mentor Dashboard"
        description="Track your assigned interns, training progress, and recent activity."
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

      {/* Non-destructive warning banner */}
      {refreshError && (
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg flex items-center justify-between text-xs font-semibold shadow-xs text-left">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
            <span>{refreshError}</span>
          </div>
          <button
            onClick={() => setRefreshError('')}
            className="text-red-500 hover:text-red-800 font-bold focus:outline-none"
            aria-label="Dismiss banner"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 1. Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MentorMetricCard
          label="Ongoing Trainees"
          value={stats.interns?.ongoing}
          icon={GraduationCap}
        />
        <MentorMetricCard
          label="Completed Trainees"
          value={stats.interns?.completed}
          icon={CheckCircle2}
        />
        <MentorMetricCard
          label="Issued Certificates"
          value={stats.interns?.issued}
          icon={Award}
        />
        <MentorMetricCard
          label="Pending Placements"
          value={stats.assignments?.pendingCurrent}
          icon={Clock}
        />
      </div>

      {/* 2. Main Dashboard Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Columns (Overview & Progress Updates) */}
        <div className="lg:col-span-2 flex flex-col gap-6 w-full">
          {/* Recent Progress Updates */}
          <Card title="Recent Progress Updates" subtitle="Latest logs entered for your trainee placements">
            {recentActivity.recentProgressUpdates?.length === 0 ? (
              <EmptyState
                title="No progress updates"
                description="You have not logged any progress updates for your trainees yet."
                className="py-10 border-0 bg-transparent"
              />
            ) : (
              <div className="overflow-x-auto select-none">
                <table className="w-full text-left text-xs border-collapse min-w-[500px]">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-slate-800 text-gray-400 font-semibold">
                      <th className="pb-3 text-left">Intern Name</th>
                      <th className="pb-3 text-left">Progress Percentage</th>
                      <th className="pb-3 text-left">Logged On</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentActivity.recentProgressUpdates.map((update) => (
                      <tr key={update.id} className="border-b border-gray-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="py-3.5 font-semibold text-gray-900 dark:text-white">{update.internName}</td>
                        <td className="py-3.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-900 dark:text-white w-8">{update.progressPercentage}%</span>
                            <div className="h-1.5 w-24 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-indigo-500 rounded-full"
                                style={{ width: `${update.progressPercentage}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 text-gray-500 dark:text-gray-400">{formatDate(update.recordedAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          {/* Recent Placements */}
          <Card title="Recent Placement Assignments" subtitle="Latest assignment mappings routed to you">
            {recentActivity.recentAssignments?.length === 0 ? (
              <EmptyState
                title="No assignments found"
                description="You do not have any pending or previous intern placements."
                className="py-10 border-0 bg-transparent"
              />
            ) : (
              <div className="overflow-x-auto select-none">
                <table className="w-full text-left text-xs border-collapse min-w-[500px]">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-slate-800 text-gray-400 font-semibold">
                      <th className="pb-3 text-left">Intern Name</th>
                      <th className="pb-3 text-left">Status</th>
                      <th className="pb-3 text-left">Assigned Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentActivity.recentAssignments.map((assignment) => (
                      <tr key={assignment.id} className="border-b border-gray-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="py-3.5 font-semibold text-gray-900 dark:text-white">{assignment.internName}</td>
                        <td className="py-3.5">
                          <Badge variant={getAssignmentStatusVariant(assignment.status)} dot>
                            {getAssignmentStatusLabel(assignment.status)}
                          </Badge>
                        </td>
                        <td className="py-3.5 text-gray-500 dark:text-gray-400">{formatDate(assignment.assignedAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>

        {/* Right Columns (Decision Ratios & Navigation) */}
        <div className="lg:col-span-1 flex flex-col gap-6 w-full">
          {/* Assignment ratios */}
          <Card title="Assignment Overview" subtitle="Status counts for your assigned placements">
            <div className="flex flex-col gap-5 text-left mt-1 select-none">
              {/* Pending */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-gray-700 dark:text-gray-300">
                  <span>Pending Decisions</span>
                  <span className="text-gray-900 dark:text-white">{stats.assignments?.pendingCurrent} ({pendingPct}%)</span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all duration-300"
                    style={{ width: `${pendingPct}%` }}
                  />
                </div>
              </div>

              {/* Accepted */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-gray-700 dark:text-gray-300">
                  <span>Accepted Placements</span>
                  <span className="text-gray-900 dark:text-white">{stats.assignments?.acceptedAllTime} ({acceptedPct}%)</span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                    style={{ width: `${acceptedPct}%` }}
                  />
                </div>
              </div>

              {/* Rejected */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-gray-700 dark:text-gray-300">
                  <span>Rejected Placements</span>
                  <span className="text-gray-900 dark:text-white">{stats.assignments?.rejectedAllTime} ({rejectedPct}%)</span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-rose-500 rounded-full transition-all duration-300"
                    style={{ width: `${rejectedPct}%` }}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Quick Actions Panel */}
          <Card title="Quick Navigation" subtitle="Direct access to operational views">
            <div className="flex flex-col gap-3 text-left">
              <Link
                to="/mentor/assignments"
                className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:border-gray-350 dark:hover:border-slate-700 text-xs font-semibold text-gray-700 dark:text-gray-300 transition-all duration-150 group"
              >
                <span>Respond to Placements</span>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-indigo-600 transition-colors" />
              </Link>
              <Link
                to="/mentor/interns"
                className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:border-gray-350 dark:hover:border-slate-700 text-xs font-semibold text-gray-700 dark:text-gray-300 transition-all duration-150 group"
              >
                <span>Track Ongoing Interns</span>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-indigo-600 transition-colors" />
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
