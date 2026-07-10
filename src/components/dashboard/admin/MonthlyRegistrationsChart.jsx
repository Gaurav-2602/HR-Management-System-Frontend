import React from 'react';
import Card from '../../common/Card';
import { fillMonthlyRegistrations } from '../../../utils/dashboard';

/**
 * Renders chronological 12-month intern registration trend chart using CSS flexbox layout
 */
export default function MonthlyRegistrationsChart({ data = [] }) {
  const filledData = fillMonthlyRegistrations(data);

  // Determine peak count to safely scale vertical bar heights
  const peakCount = Math.max(...filledData.map((item) => item.count), 0);

  return (
    <Card
      title="Monthly Registrations"
      subtitle="Chronological registration trend over the last 12 months"
      className="w-full"
    >
      <div className="flex flex-col h-64 mt-2 justify-between">
        {/* Chart Bars */}
        <div className="flex-1 flex items-end justify-between gap-1 sm:gap-3 border-b border-gray-200 dark:border-slate-800 pb-2 relative h-40">
          {filledData.map((item, idx) => {
            const percentage = peakCount > 0 ? (item.count / peakCount) * 100 : 0;
            return (
              <div
                key={`${item.year}-${item.month}-${idx}`}
                className="flex-1 flex flex-col items-center justify-end h-full group relative"
              >
                {/* Numeric Indicator on Hover */}
                <div className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-slate-900 text-white text-[10px] font-medium rounded py-1 px-1.5 pointer-events-none z-10 whitespace-nowrap shadow-md">
                  {item.count} registered
                </div>

                {/* Vertical Bar */}
                <div
                  className={`w-full rounded-t transition-all duration-300 ${
                    item.count > 0 ? 'bg-indigo-600 group-hover:bg-indigo-700' : 'bg-gray-150 dark:bg-slate-800 border-t border-dashed border-gray-300 dark:border-slate-700'
                  }`}
                  style={{ height: `${percentage > 0 ? Math.max(percentage, 4) : 0}%` }}
                />

                {/* Top Count Label (visible permanently for non-zero items) */}
                {item.count > 0 && (
                  <span className="text-[9px] font-bold text-indigo-700 dark:text-indigo-400 mb-0.5 select-none absolute" style={{ bottom: `${percentage > 0 ? percentage : 4}%` }}>
                    {item.count}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Month Labels */}
        <div className="flex justify-between gap-1 sm:gap-3 mt-2 select-none">
          {filledData.map((item, idx) => (
            <div key={idx} className="flex-1 text-center flex flex-col min-w-0">
              <span className="text-[9px] sm:text-xs font-semibold text-gray-700 dark:text-gray-350 truncate">
                {item.label}
              </span>
              <span className="text-[8px] text-gray-400 dark:text-gray-500">
                '{item.yearLabel}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
