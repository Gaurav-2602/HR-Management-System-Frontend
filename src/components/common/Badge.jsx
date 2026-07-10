import React from 'react';

/**
 * Reusable Badge component to show statuses, categories, or labels.
 */
export default function Badge({
  children,
  variant = 'neutral',
  className = '',
  dot = false,
  ...props
}) {
  const variantClasses = {
    neutral: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-slate-800 dark:text-gray-300 dark:border-slate-700',
    info: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/50',
    warning: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/50',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50',
    danger: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/50',
    default: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-slate-800 dark:text-gray-300 dark:border-slate-700',
  };

  const dotClasses = {
    neutral: 'bg-gray-400',
    info: 'bg-blue-500',
    warning: 'bg-amber-500',
    success: 'bg-emerald-500',
    danger: 'bg-rose-500',
    default: 'bg-gray-400',
  };

  const selectedVariant = variantClasses[variant] || variantClasses.default;
  const selectedDot = dotClasses[variant] || dotClasses.default;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${selectedVariant} ${className}`}
      {...props}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${selectedDot}`} />
      )}
      {children}
    </span>
  );
}
