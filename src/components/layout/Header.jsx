import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, LogOut, Sun, Moon } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import { ThemeContext } from '../../context/ThemeContext';

/**
 * Top Header component of the application shell
 */
export default function Header({ onMenuClick }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const { theme, toggleTheme } = useContext(ThemeContext);

  if (!user) return null;

  // Derives current page title from current route location
  const getPageTitle = (pathname) => {
    const path = pathname.toLowerCase();
    if (path.includes('/dashboard')) return 'Dashboard Overview';
    if (path.includes('/mentors')) return 'Mentors Management';
    if (path.includes('/interns')) return 'Interns & Candidates';
    if (path.includes('/assignments')) return 'Assignments & Evaluations';
    if (path.includes('/certificates')) return 'Certificates Manager';
    return 'Portal';
  };

  // Get user initials for avatar fallback
  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0][0].toUpperCase();
  };

  const roleLabel = user.role === 'HR_ADMIN' ? 'HR Admin' : 'Mentor';

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 px-6 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-4">
        {/* Mobile menu trigger */}
        <button
          onClick={onMenuClick}
          className="md:hidden p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white transition-colors border border-gray-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Page Title */}
        <h1 className="text-base font-semibold text-gray-900 dark:text-white md:text-lg">
          {getPageTitle(location.pathname)}
        </h1>
      </div>

      {/* User Actions & Session details */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-3 pr-2 border-r border-gray-150 dark:border-slate-800">
          {/* Initials Avatar */}
          <div className="h-9 w-9 rounded-full bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-center text-indigo-700 dark:text-indigo-400 font-semibold text-sm shrink-0">
            {getInitials(user.fullName)}
          </div>
          
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-semibold text-gray-900 dark:text-white leading-none mb-1">
              {user.fullName}
            </span>
            <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 tracking-wider uppercase">
              {roleLabel}
            </span>
          </div>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white transition-colors border border-gray-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20 flex items-center justify-center"
          aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
        >
          {theme === 'light' ? <Moon className="h-4.5 w-4.5" /> : <Sun className="h-4.5 w-4.5" />}
        </button>

        {/* Log Out Control */}
        <button
          onClick={logout}
          className="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-400 transition-colors border border-gray-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-red-500/20 flex items-center justify-center"
          title="Sign out of portal"
          aria-label="Sign out"
        >
          <LogOut className="h-4.5 w-4.5" />
        </button>
      </div>
    </header>
  );
}

