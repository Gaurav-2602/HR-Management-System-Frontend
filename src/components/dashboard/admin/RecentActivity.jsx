import React, { useState } from 'react';
import Card from '../../common/Card';
import EmptyState from '../../common/EmptyState';
import Badge from '../../common/Badge';
import { getAssignmentStatusLabel, getAssignmentStatusVariant } from '../../../utils/status';
import { formatDate } from '../../../utils/dashboard';

/**
 * Renders recent activity logs across three tabs: registrations, assignments, and certificates
 */
export default function RecentActivity({
  recentRegistrations = [],
  recentAssignments = [],
  recentCertificates = []
}) {
  const [activeTab, setActiveTab] = useState('registrations');

  const tabs = [
    { id: 'registrations', label: 'Recent Registrations', count: recentRegistrations.length },
    { id: 'assignments', label: 'Recent Assignments', count: recentAssignments.length },
    { id: 'certificates', label: 'Recent Certificates', count: recentCertificates.length },
  ];

  return (
    <Card
      title="Recent Operations Activity"
      subtitle="Operational logs for registrations, assignments, and certificates"
      className="w-full text-left"
      bodyClassName="p-0" // Flush tables in Card body
    >
      {/* Accessible Tabs Bar */}
      <div className="border-b border-gray-200 dark:border-slate-800 px-6 bg-slate-50/50 dark:bg-slate-800/20 flex gap-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`py-3 px-1 text-xs font-semibold border-b-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 rounded-t
              ${
                activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }
            `}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-gray-150 dark:bg-slate-800 text-gray-600 dark:text-gray-300">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className="p-6">
        {/* Tab 1: Recent Registrations */}
        {activeTab === 'registrations' && (
          <div role="tabpanel">
            {recentRegistrations.length === 0 ? (
              <EmptyState
                title="No recent registrations"
                description="No active interns have registered in the system recently."
                className="py-12 border-0 bg-transparent"
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-slate-800 text-gray-400 font-semibold">
                      <th className="pb-3 text-left">Name</th>
                      <th className="pb-3 text-left">Intern ID</th>
                      <th className="pb-3 text-left">Registered</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentRegistrations.map((reg) => (
                      <tr key={reg.id} className="border-b border-gray-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30">
                        <td className="py-3 font-semibold text-gray-900 dark:text-white">{reg.fullName}</td>
                        <td className="py-3 text-gray-500 dark:text-gray-400 font-mono">{reg.internId}</td>
                        <td className="py-3 text-gray-500 dark:text-gray-400">{formatDate(reg.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Recent Assignments */}
        {activeTab === 'assignments' && (
          <div role="tabpanel">
            {recentAssignments.length === 0 ? (
              <EmptyState
                title="No recent assignments"
                description="No task sheet assignments have been registered recently."
                className="py-12 border-0 bg-transparent"
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-slate-800 text-gray-400 font-semibold">
                      <th className="pb-3 text-left">Intern</th>
                      <th className="pb-3 text-left">Mentor</th>
                      <th className="pb-3 text-left">Status</th>
                      <th className="pb-3 text-left">Assigned</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentAssignments.map((assign) => (
                      <tr key={assign.id} className="border-b border-gray-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30">
                        <td className="py-3 font-semibold text-gray-900 dark:text-white">{assign.internName}</td>
                        <td className="py-3 text-gray-700 dark:text-gray-300">{assign.mentorName}</td>
                        <td className="py-3">
                          <Badge variant={getAssignmentStatusVariant(assign.status)} dot>
                            {getAssignmentStatusLabel(assign.status)}
                          </Badge>
                        </td>
                        <td className="py-3 text-gray-500 dark:text-gray-400">{formatDate(assign.assignedAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Recent Certificates */}
        {activeTab === 'certificates' && (
          <div role="tabpanel">
            {recentCertificates.length === 0 ? (
              <EmptyState
                title="No certificates issued"
                description="No completion certificates have been issued in the system recently."
                className="py-12 border-0 bg-transparent"
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-slate-800 text-gray-400 font-semibold">
                      <th className="pb-3 text-left">Name</th>
                      <th className="pb-3 text-left">Certificate Number</th>
                      <th className="pb-3 text-left">Issued</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentCertificates.map((cert) => (
                      <tr key={cert.id} className="border-b border-gray-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30">
                        <td className="py-3 font-semibold text-gray-900 dark:text-white">{cert.fullName}</td>
                        <td className="py-3 text-indigo-650 dark:text-indigo-400 font-semibold font-mono">{cert.certificateNumber}</td>
                        <td className="py-3 text-gray-500 dark:text-gray-400">{formatDate(cert.issuedAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
