import React from 'react';
import Card from '../../common/Card';
import Badge from '../../common/Badge';
import { getInternStatusLabel, getInternStatusVariant } from '../../../utils/status';

/**
 * Renders pipeline distribution for each of the six intern statuses
 */
export default function InternStatusOverview({ byStatus = {} }) {
  const statuses = ['NEW', 'ASSIGNED', 'REJECTED_BY_MENTOR', 'ONGOING', 'COMPLETED', 'ISSUED'];

  return (
    <Card
      title="Intern Pipeline Overview"
      subtitle="Pipeline distribution of all active interns"
      className="h-full"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statuses.map((status) => {
          const count = byStatus[status] || 0;
          const displayLabel = status === 'REJECTED_BY_MENTOR' ? 'Rejected' : getInternStatusLabel(status);
          return (
            <div
              key={status}
              className="flex flex-col justify-between min-h-[92px] p-3.5 border border-gray-150 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-800/20 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors text-left"
            >
              <div className="flex items-start">
                <Badge
                  variant={getInternStatusVariant(status)}
                  dot
                  className="max-w-full truncate text-[10px] px-2 py-0.5 shrink-0"
                  title={displayLabel}
                >
                  {displayLabel}
                </Badge>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white leading-none mt-2">
                {count}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
