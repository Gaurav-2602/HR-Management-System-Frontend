import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Reusable Spinner component for loading states.
 */
export default function Spinner({
  size = 'md',
  color = 'text-indigo-600',
  label = '',
  className = '',
  ...props
}) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  const selectedSize = sizeClasses[size] || sizeClasses.md;

  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 ${className}`}
      role="status"
      {...props}
    >
      <Loader2 className={`animate-spin ${selectedSize} ${color}`} />
      {label && (
        <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
          {label}
        </span>
      )}
      <span className="sr-only">Loading...</span>
    </div>
  );
}
