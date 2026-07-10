import React from 'react';

/**
 * Reusable summary metric card for admin dashboard
 */
export default function AdminMetricCard({ label, value, icon: Icon, className = '' }) {
  const displayValue = typeof value === 'number' ? value : 0;

  return (
    <div className={`bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-6 shadow-xs flex items-center justify-between gap-4 ${className}`}>
      <div className="flex flex-col gap-1 text-left">
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</span>
        <span className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
          {displayValue}
        </span>
      </div>
      {Icon && (
        <div className="p-3 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 rounded-xl shrink-0">
          <Icon className="h-6 w-6" />
        </div>
      )}
    </div>
  );
}
