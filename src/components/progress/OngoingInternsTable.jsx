import React from 'react';
import { Eye, TrendingUp, History, CheckSquare } from 'lucide-react';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { getInternStatusLabel, getInternStatusVariant } from '../../utils/status';
import { formatDate } from '../../utils/dashboard';

/**
 * Tabular layout of ongoing interns for the mentor view
 */
export default function OngoingInternsTable({ interns = [], onViewDetails, onRecordProgress, onViewHistory, onCompleteTraining }) {
  return (
    <div className="overflow-x-auto w-full border border-gray-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 shadow-xs">
      <table className="w-full text-left text-sm border-collapse min-w-[950px]">
        <thead>
          <tr className="border-b border-gray-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-gray-500 dark:text-gray-400 font-semibold select-none">
            <th className="px-6 py-4">Intern</th>
            <th className="px-6 py-4">Branch</th>
            <th className="px-6 py-4">Training Type</th>
            <th className="px-6 py-4">Timeline</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
          {interns.map((intern) => (
            <tr key={intern.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
              {/* Intern */}
              <td className="px-6 py-4">
                <div className="flex flex-col text-left">
                  <span className="font-semibold text-gray-900 dark:text-white">{intern.fullName}</span>
                  <span className="text-[10px] text-gray-500 dark:text-gray-400 font-mono mt-0.5">{intern.internId}</span>
                </div>
              </td>
              {/* Branch */}
              <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                {intern.branch}
              </td>
              {/* Training Type */}
              <td className="px-6 py-4 text-gray-600 dark:text-gray-300 font-medium">
                {intern.trainingType}
              </td>
              {/* Timeline */}
              <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                {formatDate(intern.startDate)} to {formatDate(intern.endDate)}
              </td>
              {/* Status */}
              <td className="px-6 py-4">
                <Badge variant={getInternStatusVariant(intern.status)} dot>
                  {getInternStatusLabel(intern.status)}
                </Badge>
              </td>
              {/* Actions */}
              <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-1.5">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Eye}
                    onClick={() => onViewDetails(intern.id)}
                    aria-label={`View details of ${intern.fullName}`}
                    title="View details"
                  >
                    Details
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={TrendingUp}
                    onClick={() => onRecordProgress(intern)}
                    aria-label={`Record progress for ${intern.fullName}`}
                    title="Record progress"
                  >
                    Progress
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={History}
                    onClick={() => onViewHistory(intern)}
                    aria-label={`View progress history for ${intern.fullName}`}
                    title="View history"
                  >
                    History
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={CheckSquare}
                    onClick={() => onCompleteTraining(intern)}
                    className="text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                    aria-label={`Complete training for ${intern.fullName}`}
                    title="Complete training"
                  >
                    Complete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
