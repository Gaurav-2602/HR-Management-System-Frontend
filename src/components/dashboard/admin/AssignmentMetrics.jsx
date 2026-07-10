import React from 'react';
import Card from '../../common/Card';

/**
 * Renders assignment decision ratio and metric details using CSS progress bars
 */
export default function AssignmentMetrics({ pendingCurrent = 0, acceptedAllTime = 0, rejectedAllTime = 0 }) {
  const totalDecisions = acceptedAllTime + rejectedAllTime;
  const acceptedRatio = totalDecisions > 0 ? Math.round((acceptedAllTime / totalDecisions) * 100) : 0;
  const rejectedRatio = totalDecisions > 0 ? Math.round((rejectedAllTime / totalDecisions) * 100) : 0;

  return (
    <Card
      title="Assignment Evaluations"
      subtitle="Evaluation decisions and submission metrics"
      className="h-full"
    >
      <div className="flex flex-col gap-6 text-left">
        {/* Total Decisions summary */}
        <div>
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Evaluation Decision Ratio
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-extrabold text-gray-900 dark:text-white">{acceptedRatio}%</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">accepted of all decisions</span>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Excludes {pendingCurrent} pending task sheets awaiting review.
          </p>
        </div>

        {/* Progress Bars */}
        <div className="space-y-4">
          {/* Pending */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-medium text-gray-700 dark:text-gray-300">
              <span>Pending Evaluations</span>
              <span className="font-semibold text-gray-900 dark:text-white">{pendingCurrent}</span>
            </div>
            <div className="h-2 w-full bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full" style={{ width: pendingCurrent > 0 ? '100%' : '0%' }} />
            </div>
          </div>

          {/* Accepted */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-medium text-gray-700 dark:text-gray-300">
              <span>Accepted Assignments</span>
              <span className="font-semibold text-gray-900 dark:text-white">{acceptedAllTime} ({acceptedRatio}%)</span>
            </div>
            <div className="h-2 w-full bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full transition-all duration-300" style={{ width: `${acceptedRatio}%` }} />
            </div>
          </div>

          {/* Rejected */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-medium text-gray-700 dark:text-gray-300">
              <span>Rejected by Mentor</span>
              <span className="font-semibold text-gray-900 dark:text-white">{rejectedAllTime} ({rejectedRatio}%)</span>
            </div>
            <div className="h-2 w-full bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-rose-500 rounded-full transition-all duration-300" style={{ width: `${rejectedRatio}%` }} />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
