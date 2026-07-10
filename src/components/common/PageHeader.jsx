import React from 'react';
import { ArrowLeft } from 'lucide-react';

/**
 * Reusable PageHeader component for standard page titles, actions, and back navigation.
 */
export default function PageHeader({
  title,
  description = '',
  onBack = null,
  action = null,
  className = '',
  ...props
}) {
  return (
    <div
      className={`flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-5 border-b border-gray-200 dark:border-slate-800 ${className}`}
      {...props}
    >
      <div className="flex items-start gap-3">
        {onBack && (
          <button
            onClick={onBack}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 mt-0.5 shrink-0"
            aria-label="Go back"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
        )}
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight leading-7 m-0">
            {title}
          </h1>
          {description && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>
      </div>

      {action && (
        <div className="flex items-center gap-3 shrink-0">
          {action}
        </div>
      )}
    </div>
  );
}
