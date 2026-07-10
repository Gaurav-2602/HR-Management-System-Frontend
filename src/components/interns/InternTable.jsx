import React from 'react';
import { Eye, Edit2, Trash2 } from 'lucide-react';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { getInternStatusLabel, getInternStatusVariant } from '../../utils/status';
import { formatDate } from '../../utils/dashboard';

/**
 * Tabular layout of interns for the admin view
 */
export default function InternTable({ interns = [], onView, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto w-full border border-gray-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 shadow-xs">
      <table className="w-full text-left text-sm border-collapse min-w-[900px]">
        <thead>
          <tr className="border-b border-gray-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-gray-500 dark:text-gray-400 font-semibold select-none">
            <th className="px-6 py-4">Intern ID</th>
            <th className="px-6 py-4">Name</th>
            <th className="px-6 py-4">Email</th>
            <th className="px-6 py-4">Training Type</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Start Date</th>
            <th className="px-6 py-4">End Date</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
          {interns.map((intern) => (
            <tr key={intern.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
              {/* Intern ID */}
              <td className="px-6 py-4 font-mono font-semibold text-gray-700 dark:text-gray-300 text-xs">
                {intern.internId}
              </td>
              {/* Name */}
              <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                {intern.fullName}
              </td>
              {/* Email */}
              <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                {intern.email}
              </td>
              {/* Training Type */}
              <td className="px-6 py-4 text-gray-600 dark:text-gray-300 font-medium">
                {intern.trainingType}
              </td>
              {/* Status */}
              <td className="px-6 py-4">
                <Badge variant={getInternStatusVariant(intern.status)} dot>
                  {getInternStatusLabel(intern.status)}
                </Badge>
              </td>
              {/* Start Date */}
              <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                {formatDate(intern.startDate)}
              </td>
              {/* End Date */}
              <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                {formatDate(intern.endDate)}
              </td>
              {/* Actions */}
              <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Eye}
                    onClick={() => onView(intern)}
                    aria-label={`View details of ${intern.fullName}`}
                    title="View details"
                  >
                    View
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Edit2}
                    onClick={() => onEdit(intern)}
                    aria-label={`Edit ${intern.fullName}`}
                    title="Edit intern"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Trash2}
                    onClick={() => onDelete(intern)}
                    className="text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 hover:text-rose-700"
                    aria-label={`Delete ${intern.fullName}`}
                    title="Delete intern"
                  >
                    Delete
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
