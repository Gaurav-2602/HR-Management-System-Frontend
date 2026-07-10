import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  FileText,
  Award,
  X
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';

/**
 * Navigation Sidebar component. Renders dynamically based on role.
 */
export default function Sidebar({ isOpen, onClose }) {
  const { user } = useAuth();

  if (!user) return null;

  // Define navigation items per role
  const adminNav = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Mentors', path: '/admin/mentors', icon: Users },
    { name: 'Interns', path: '/admin/interns', icon: GraduationCap },
    { name: 'Assignments', path: '/admin/assignments', icon: FileText },
    { name: 'Certificates', path: '/admin/certificates', icon: Award },
  ];

  const mentorNav = [
    { name: 'Dashboard', path: '/mentor/dashboard', icon: LayoutDashboard },
    { name: 'Assignments', path: '/mentor/assignments', icon: FileText },
    { name: 'Ongoing Interns', path: '/mentor/interns', icon: GraduationCap },
  ];

  const navItems = user.role === 'HR_ADMIN' ? adminNav : mentorNav;

  const handleLinkClick = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <aside className="flex flex-col h-full bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800">
      {/* Brand & Close button on Mobile */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-slate-800">
        <div>
          <h2 className="text-base font-bold text-gray-900 dark:text-white leading-tight">HR Management</h2>
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Management Portal</span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden p-1 rounded-lg text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-600 dark:hover:text-white transition-colors"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={handleLinkClick}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 outline-none focus:ring-2 focus:ring-indigo-500/20
                ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 shadow-xs'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white'
                }`
              }
            >
              <Icon className="h-4.5 w-4.5 shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
