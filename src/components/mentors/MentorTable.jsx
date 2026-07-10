import React from 'react';
import { Edit2, ShieldCheck, ShieldAlert } from 'lucide-react';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { formatDate } from '../../utils/dashboard';

/**
 * Tabular layout of mentors for the admin view
 */
export default function MentorTable({ mentors = [], onEdit, onToggleStatus }) {
  return (
    <div className="overflow-x-auto w-full border border-gray-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 shadow-xs">
      <table className="w-full text-left text-sm border-collapse min-w-[700px]">
        <thead>
          <tr className="border-b border-gray-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-gray-500 dark:text-gray-400 font-semibold select-none">
            <th className="px-6 py-4">Mentor</th>
            <th className="px-6 py-4">Email</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Registered On</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
          {mentors.map((mentor) => (
            <tr key={mentor.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
              {/* Name */}
              <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                {mentor.fullName}
              </td>
              {/* Email */}
              <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                {mentor.email}
              </td>
              {/* Status */}
              <td className="px-6 py-4">
                <Badge variant={mentor.isActive ? 'success' : 'danger'} dot>
                  {mentor.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </td>
              {/* Date */}
              <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                {formatDate(mentor.createdAt)}
              </td>
              {/* Actions */}
              <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Edit2}
                    onClick={() => onEdit(mentor)}
                    aria-label={`Edit ${mentor.fullName}`}
                  >
                    Edit
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={mentor.isActive ? ShieldAlert : ShieldCheck}
                    onClick={() => onToggleStatus(mentor)}
                    className={mentor.isActive ? 'text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 hover:text-rose-700' : 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 hover:text-emerald-700'}
                    aria-label={mentor.isActive ? `Deactivate ${mentor.fullName}` : `Activate ${mentor.fullName}`}
                  >
                    {mentor.isActive ? 'Deactivate' : 'Activate'}
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
