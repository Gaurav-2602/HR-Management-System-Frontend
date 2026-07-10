import React, { useState } from 'react';
import { Plus, CheckCircle, HelpCircle, ArrowRight } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import CreateAssignmentModal from '../../components/assignments/CreateAssignmentModal';
import { formatDate } from '../../utils/dashboard';

/**
 * HR Admin portal for creating task assignments
 */
export default function AssignmentsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [successDetails, setSuccessDetails] = useState(null);

  const handleAssignmentSuccess = (assignment) => {
    setSuccessDetails(assignment);
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Admin Assignments"
        description="Oversee the placement program workflow by matching interns with active mentors."
        action={
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => setModalOpen(true)}
          >
            Assign Intern
          </Button>
        }
      />

      {/* 1. Successful Placement Details Card */}
      {successDetails && (
        <Card
          title="Intern Assigned Successfully"
          subtitle="The placement request has been recorded and is pending mentor acceptance"
          className="border-emerald-200 bg-emerald-50/20"
        >
          <div className="flex flex-col gap-4 text-left">
            <div className="flex items-center gap-3 text-emerald-800 font-semibold text-sm">
              <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
              <span>Matching Successful</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white border border-emerald-100 p-4 rounded-xl text-xs shadow-xs">
              <div className="flex flex-col">
                <span className="text-gray-500 font-medium">Intern Details</span>
                <span className="text-gray-900 font-bold mt-1">
                  {successDetails.intern?.fullName || 'Trainee'}
                </span>
                <span className="text-gray-500 font-mono mt-0.5">
                  {successDetails.intern?.internId || successDetails.internId}
                </span>
              </div>

              <div className="flex items-center justify-center hidden sm:flex text-gray-300">
                <ArrowRight className="h-5 w-5" />
              </div>

              <div className="flex flex-col">
                <span className="text-gray-500 font-medium">Assigned Mentor ID</span>
                <span className="text-gray-900 font-mono font-bold mt-1">
                  {successDetails.mentorId}
                </span>
                <span className="text-gray-400 mt-0.5">Role: Program Mentor</span>
              </div>
            </div>

            <div className="flex justify-between items-center text-xs text-gray-500 border-t border-gray-100 pt-3">
              <span>Assigned Date: {formatDate(successDetails.assignedAt)}</span>
              <button
                onClick={() => setSuccessDetails(null)}
                className="text-indigo-600 hover:text-indigo-800 font-semibold focus:outline-none"
              >
                Clear Confirmation
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* 2. Process Instructions Guide */}
      <Card title="Task Placement Workflow Guide">
        <div className="flex flex-col gap-5 text-left text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
          <p>
            The placement matches trainees with specific program mentors. Use this panel to initiate mappings.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
            <div className="border border-gray-150 dark:border-slate-800 p-4 rounded-xl bg-slate-50/50 dark:bg-slate-800/20 flex flex-col gap-2">
              <div className="h-7 w-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 text-indigo-700 dark:text-indigo-400 flex items-center justify-center font-bold text-xs">
                1
              </div>
              <h5 className="font-bold text-gray-900 dark:text-white text-xs">Matching Intern</h5>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Select from interns with status <strong className="text-gray-700 dark:text-gray-300">New</strong> or{' '}
                <strong className="text-gray-700 dark:text-gray-300">Rejected by Mentor</strong>.
              </p>
            </div>

            <div className="border border-gray-150 dark:border-slate-800 p-4 rounded-xl bg-slate-50/50 dark:bg-slate-800/20 flex flex-col gap-2">
              <div className="h-7 w-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 text-indigo-700 dark:text-indigo-400 flex items-center justify-center font-bold text-xs">
                2
              </div>
              <h5 className="font-bold text-gray-900 dark:text-white text-xs">Pending Decision</h5>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                The assignment status starts as <strong className="text-gray-700 dark:text-gray-300">Pending</strong>, blocking other assignments.
              </p>
            </div>

            <div className="border border-gray-150 dark:border-slate-800 p-4 rounded-xl bg-slate-50/50 dark:bg-slate-800/20 flex flex-col gap-2">
              <div className="h-7 w-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 text-indigo-700 dark:text-indigo-400 flex items-center justify-center font-bold text-xs">
                3
              </div>
              <h5 className="font-bold text-gray-900 dark:text-white text-xs">Onboarding Start</h5>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Acceptance shifts the intern to <strong className="text-gray-700 dark:text-gray-300">Ongoing</strong>. Rejection returns them to the pool.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 p-3 rounded-lg text-xs text-indigo-800 dark:text-indigo-350 mt-2">
            <HelpCircle className="h-4.5 w-4.5 shrink-0 text-indigo-600 dark:text-indigo-400 mt-0.5" />
            <div>
              <strong>Audit Trail:</strong> Inactive mentors are excluded from matching. All historical rejections and
              remarks are archived for administrative reference.
            </div>
          </div>
        </div>
      </Card>

      <CreateAssignmentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={handleAssignmentSuccess}
      />
    </div>
  );
}
