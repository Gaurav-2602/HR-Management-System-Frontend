import React from 'react';
import { FolderOpen } from 'lucide-react';

/**
 * Reusable EmptyState component for empty lists, search results, or modules.
 */
export default function EmptyState({
  title = 'No data found',
  description = 'There are no items to display at the moment.',
  icon: Icon = FolderOpen,
  action = null,
  className = '',
  ...props
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-gray-200 dark:border-slate-800 rounded-xl bg-gray-50/50 dark:bg-slate-900/10 ${className}`}
      {...props}
    >
      <div className="p-3 bg-gray-100 dark:bg-slate-800 rounded-lg text-gray-400 dark:text-gray-500 mb-4">
        {Icon && <Icon className="h-6 w-6" />}
      </div>
      
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
        {title}
      </h3>
      
      <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mb-5 leading-relaxed">
        {description}
      </p>

      {action && (
        <div className="flex justify-center">
          {action}
        </div>
      )}
    </div>
  );
}
