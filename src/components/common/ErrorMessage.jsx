import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import Button from './Button';

/**
 * Reusable ErrorMessage component for page-level or section-level error states.
 */
export default function ErrorMessage({
  title = 'Something went wrong',
  message = 'An error occurred while loading this section. Please try again.',
  onRetry = null,
  retryLabel = 'Try again',
  icon: Icon = AlertCircle,
  className = '',
  ...props
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-6 border border-red-100 dark:border-red-950/40 bg-red-50/30 dark:bg-red-950/10 rounded-xl ${className}`}
      {...props}
    >
      <div className="p-2.5 bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 rounded-lg mb-3">
        {Icon && <Icon className="h-5 w-5" />}
      </div>

      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
        {title}
      </h4>

      <p className="text-xs text-gray-500 dark:text-gray-400 max-w-md mb-4 leading-relaxed">
        {message}
      </p>

      {onRetry && (
        <Button
          variant="secondary"
          size="sm"
          icon={RefreshCw}
          onClick={onRetry}
          className="text-xs font-semibold"
        >
          {retryLabel}
        </Button>
      )}
    </div>
  );
}
