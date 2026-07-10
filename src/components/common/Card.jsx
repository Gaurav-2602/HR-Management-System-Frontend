import React from 'react';

/**
 * Reusable Card component for UI sections and containers.
 */
export default function Card({
  children,
  title,
  subtitle,
  headerAction,
  footer,
  className = '',
  bodyClassName = 'p-6',
  ...props
}) {
  return (
    <div
      className={`bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden ${className}`}
      {...props}
    >
      {(title || subtitle || headerAction) && (
        <div className="border-b border-gray-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between gap-4">
          <div>
            {title && (
              <h3 className="text-base font-semibold text-gray-900 dark:text-white leading-6">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {subtitle}
              </p>
            )}
          </div>
          {headerAction && (
            <div className="flex items-center shrink-0">
              {headerAction}
            </div>
          )}
        </div>
      )}
      
      <div className={bodyClassName}>
        {children}
      </div>

      {footer && (
        <div className="bg-gray-50 dark:bg-slate-800/40 border-t border-gray-200 dark:border-slate-800 px-6 py-4 flex items-center justify-end gap-3">
          {footer}
        </div>
      )}
    </div>
  );
}
