import React from 'react';

/**
 * Reusable Textarea component.
 */
export default function Textarea({
  label,
  id,
  placeholder = '',
  error = '',
  disabled = false,
  required = false,
  rows = 4,
  value,
  onChange,
  className = '',
  ...props
}) {
  return (
    <div className={`flex flex-col gap-1 w-full ${className}`}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-0.5">
          {label}
          {required && <span className="text-red-500" aria-hidden="true">*</span>}
        </label>
      )}
      <textarea
        id={id}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        rows={rows}
        value={value}
        onChange={onChange}
        className={`w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border rounded-lg shadow-sm transition-all duration-200 outline-none resize-y placeholder-gray-400 dark:placeholder-gray-500
          ${error 
            ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
            : 'border-gray-300 dark:border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
          }
          ${disabled ? 'bg-gray-50 dark:bg-slate-900/40 text-gray-500 dark:text-gray-400 cursor-not-allowed border-gray-200 dark:border-slate-800' : 'text-gray-900 dark:text-white'}
        `}
        {...props}
      />
      {error && (
        <span className="text-xs text-red-600 mt-0.5 font-medium" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
