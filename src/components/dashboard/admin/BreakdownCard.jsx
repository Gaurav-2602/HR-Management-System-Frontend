import React from 'react';
import Card from '../../common/Card';
import EmptyState from '../../common/EmptyState';

/**
 * Reusable breakdown list with proportional progress indicators
 */
export default function BreakdownCard({ title, subtitle, items = [], labelKey }) {
  const totalCount = Array.isArray(items) ? items.reduce((sum, item) => sum + (item.count || 0), 0) : 0;

  return (
    <Card title={title} subtitle={subtitle} className="h-full">
      {!items || items.length === 0 ? (
        <EmptyState
          title={`No ${title.toLowerCase()} data`}
          description={`There are no active records representing this breakdown metrics.`}
          className="py-12 border-0 bg-transparent"
        />
      ) : (
        <div className="space-y-4 max-h-[320px] overflow-y-auto pr-1">
          {items.map((item, index) => {
            const label = item[labelKey] || 'Unknown';
            const count = item.count || 0;
            const percentage = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;

            return (
              <div key={`${label}-${index}`} className="flex flex-col gap-1.5 text-left">
                {/* Labels row */}
                <div className="flex items-center justify-between text-xs gap-3">
                  <span className="font-semibold text-gray-700 dark:text-gray-300 truncate" title={label}>
                    {label}
                  </span>
                  <span className="font-bold text-gray-900 dark:text-white shrink-0">
                    {count} <span className="font-medium text-gray-400 dark:text-gray-500">({percentage}%)</span>
                  </span>
                </div>
                
                {/* Proportional CSS progress bar */}
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
