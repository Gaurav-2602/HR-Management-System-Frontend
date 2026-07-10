import React, { useState, useEffect } from 'react';
import { ClipboardCopy, Check, Ban, Calendar, User, BookOpen, Clock, AlertCircle } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';

// Modals
import RejectAssignmentModal from '../../components/assignments/RejectAssignmentModal';

// Status Helpers
import { getAssignmentStatusLabel, getAssignmentStatusVariant } from '../../utils/status';
import { formatDate } from '../../utils/dashboard';
import { assignmentService } from '../../services/assignment';

/**
 * Mentor Assignments management portal for evaluating trainee placements
 */
export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState([]);
  const [statusFilter, setStatusFilter] = useState('PENDING'); // PENDING | ACCEPTED | REJECTED | ALL

  // Loading & Error States
  const [loading, setLoading] = useState(true);
  const [listLoading, setListLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [actionError, setActionError] = useState('');

  // Confirmation Overlays States
  const [rejectOpen, setRejectOpen] = useState(false);
  const [acceptOpen, setAcceptOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [accepting, setAccepting] = useState(false);

  const fetchAssignments = async (isSilent = false) => {
    if (isSilent) {
      setListLoading(true);
      setActionError('');
    } else {
      setLoading(true);
      setErrorMsg('');
    }

    try {
      const response = await assignmentService.getMyAssignments(statusFilter);
      setAssignments(response.data || []);
    } catch (err) {
      console.error('Failed to load mentor assignments:', err);
      const msg = err.response?.data?.error || 'A network error occurred. Please verify your connection.';
      
      if (isSilent) {
        setActionError(`Failed to update task list: ${msg}`);
      } else {
        setErrorMsg(msg);
      }
    } finally {
      setLoading(false);
      setListLoading(false);
    }
  };

  useEffect(() => {
    fetchMentorsList();
  }, [statusFilter]);

  // Handle ESLint rule for dependency tracking
  const fetchMentorsList = () => {
    fetchAssignments(false);
  };

  // Accept Action Handler
  const handleOpenAccept = (assignment) => {
    setSelectedAssignment(assignment);
    setAcceptOpen(true);
  };

  const handleConfirmAccept = async () => {
    if (!selectedAssignment) return;

    setErrorMsg('');
    setAccepting(true);

    try {
      const response = await assignmentService.acceptAssignment(selectedAssignment.id);
      
      if (response && response.success !== false) {
        setAcceptOpen(false);
        // Refresh the list
        fetchAssignments(true);
      } else {
        throw new Error(response.error || 'Failed to accept assignment');
      }
    } catch (err) {
      console.error('Failed to accept task assignment:', err);
      setActionError(err.response?.data?.error || 'Failed to accept task assignment. Please try again.');
      setAcceptOpen(false);
    } finally {
      setAccepting(false);
    }
  };

  // Reject Action Handler
  const handleOpenReject = (assignment) => {
    setSelectedAssignment(assignment);
    setRejectOpen(true);
  };

  const handleRejectSuccess = () => {
    // Refresh the list
    fetchAssignments(true);
  };

  const filterTabs = [
    { id: 'PENDING', label: 'Pending Decisions' },
    { id: 'ACCEPTED', label: 'Accepted Tasks' },
    { id: 'REJECTED', label: 'Rejected Pool' },
    { id: 'ALL', label: 'All Placements' },
  ];

  // 1. Initial Loading Spinner
  if (loading && assignments.length === 0 && statusFilter === 'PENDING') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner size="lg" label="Retrieving task assignments..." />
      </div>
    );
  }

  // 2. Initial Fetch Failure
  if (errorMsg && assignments.length === 0 && statusFilter === 'PENDING') {
    return (
      <div className="min-h-[50vh] flex items-center justify-center p-4">
        <ErrorMessage
          title="Failed to fetch assignments"
          message={errorMsg}
          onRetry={() => fetchAssignments(false)}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <PageHeader
        title="Mentor Task Assignments"
        description="Review assigned placements, audit candidate academic records, and manage evaluations."
      />

      {/* Non-destructive Alert Banner */}
      {actionError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between text-xs font-semibold shadow-xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
            <span>{actionError}</span>
          </div>
          <button
            onClick={() => setActionError('')}
            className="text-red-500 hover:text-red-800 font-bold focus:outline-none"
            aria-label="Dismiss message"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Status Filter Tabs */}
      <div className="border-b border-gray-200 dark:border-slate-800 flex gap-2 overflow-x-auto select-none pb-0.5">
        {filterTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setStatusFilter(tab.id)}
            disabled={listLoading}
            className={`py-2.5 px-4 text-xs font-semibold border-b-2 whitespace-nowrap outline-none focus:ring-2 focus:ring-indigo-500/20 rounded-t transition-colors
              ${
                statusFilter === tab.id
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-indigo-50/20 dark:bg-indigo-950/20'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/40'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3. Empty States Display */}
      {assignments.length === 0 ? (
        <EmptyState
          title={`No ${getAssignmentStatusLabel(statusFilter).toLowerCase()} assignments found`}
          description={
            statusFilter === 'PENDING'
              ? 'You do not have any pending placement requests waiting for decision.'
              : 'There are no records matching the selected workflow status.'
          }
          icon={ClipboardCopy}
        />
      ) : (
        /* 4. Placement Cards Grid Layout */
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-5 transition-opacity duration-200 ${listLoading ? 'opacity-60' : 'opacity-100'}`}>
          {assignments.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden flex flex-col justify-between"
            >
              {/* Card Header */}
              <div className="px-5 py-4 border-b border-gray-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex justify-between items-center text-left">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-400 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 dark:text-white leading-tight">
                      {item.intern?.fullName || 'Trainee'}
                    </h4>
                    <span className="text-[10px] text-gray-500 dark:text-gray-400 font-mono">
                      {item.intern?.internId || 'N/A'}
                    </span>
                  </div>
                </div>
                <Badge variant={getAssignmentStatusVariant(item.status)} dot>
                  {getAssignmentStatusLabel(item.status)}
                </Badge>
              </div>

              {/* Card Body */}
              <div className="p-5 flex flex-col gap-3 text-left text-xs leading-relaxed">
                {/* Academic Qualifications info */}
                <div className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
                  <BookOpen className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-gray-505 dark:text-gray-450">Education Details</span>
                    <p className="font-semibold text-gray-800 dark:text-white">
                      {item.intern?.educationalQualification || '—'}
                    </p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                      {item.intern?.instituteName || '—'} ({item.intern?.branch || '—'})
                    </p>
                  </div>
                </div>

                {/* Training Timelines */}
                <div className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
                  <Calendar className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-gray-505 dark:text-gray-450">Placement Period</span>
                    <p className="font-semibold text-gray-800 dark:text-white">
                      {item.intern ? `${formatDate(item.intern.startDate)} to ${formatDate(item.intern.endDate)}` : '—'}
                    </p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                      Type: {item.intern?.trainingType || '—'}
                    </p>
                  </div>
                </div>

                {/* Audit Placement Logs */}
                <div className="flex items-start gap-2 text-gray-600 dark:text-gray-300 border-t border-gray-100 dark:border-slate-800 pt-3 mt-1">
                  <Clock className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
                  <div className="w-full flex justify-between">
                    <div>
                      <span className="text-[10px] text-gray-400 dark:text-gray-500">Assigned On</span>
                      <p className="font-medium text-gray-700 dark:text-gray-300">{formatDate(item.assignedAt)}</p>
                    </div>
                    {item.status !== 'PENDING' && (
                      <div className="text-right">
                        <span className="text-[10px] text-gray-400 dark:text-gray-500">Decided On</span>
                        <p className="font-medium text-gray-700 dark:text-gray-300">{formatDate(item.decidedAt)}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Rejection comments */}
                {item.status === 'REJECTED' && item.rejectionRemarks && (
                  <div className="bg-rose-50/50 dark:bg-rose-950/20 border border-rose-150 dark:border-rose-900/50 p-2.5 rounded-lg text-rose-800 dark:text-rose-300 mt-1">
                    <span className="font-bold block text-[10px] uppercase tracking-wider text-rose-900 dark:text-rose-450 mb-0.5">
                      Rejection Remarks
                    </span>
                    <p className="text-[11px] leading-tight font-medium">
                      {item.rejectionRemarks}
                    </p>
                  </div>
                )}
              </div>

              {/* Card Footer Actions (Only for PENDING status) */}
              {item.status === 'PENDING' && (
                <div className="px-5 py-3 border-t border-gray-100 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-800/20 flex justify-end gap-2 shrink-0 select-none">
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={Ban}
                    onClick={() => handleOpenReject(item)}
                    className="text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 hover:text-rose-700 border-rose-200 dark:border-rose-900/50"
                    aria-label={`Reject assignment for ${item.intern?.fullName}`}
                  >
                    Reject
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    icon={Check}
                    onClick={() => handleOpenAccept(item)}
                    className="bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500/20 text-white"
                    aria-label={`Accept assignment for ${item.intern?.fullName}`}
                  >
                    Accept
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Acceptance Confirmation Dialog */}
      <Modal
        isOpen={acceptOpen}
        onClose={() => setAcceptOpen(false)}
        title="Accept Assignment"
      >
        <div className="flex flex-col gap-4 text-left">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Are you sure you want to accept the task assignment for{' '}
            <strong className="text-gray-900 dark:text-white">
              {selectedAssignment?.intern?.fullName || 'the intern'}
            </strong>
            ?
          </p>

          <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-250 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-450 p-3 rounded-lg text-xs leading-relaxed">
            <strong>Impact:</strong> The intern status will transition to <strong>Ongoing</strong>, granting you full
            authorizations to log task sheets and evaluate daily progress.
          </div>

          <div className="flex justify-end gap-3 mt-4 border-t border-gray-100 dark:border-slate-800 pt-4">
            <Button
              variant="secondary"
              disabled={accepting}
              onClick={() => setAcceptOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              loading={accepting}
              onClick={handleConfirmAccept}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Confirm Acceptance
            </Button>
          </div>
        </div>
      </Modal>

      {/* Reject Remarks Modal Dialog */}
      <RejectAssignmentModal
        isOpen={rejectOpen}
        onClose={() => setRejectOpen(false)}
        assignment={selectedAssignment}
        onSuccess={handleRejectSuccess}
      />
    </div>
  );
}
