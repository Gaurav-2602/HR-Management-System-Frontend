import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';

/**
 * Authenticated Layout shell containing Header, Sidebar, and content router area
 */
export default function AppLayout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Close mobile sidebar on press of Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMobileSidebarOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    if (mobileSidebarOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }

    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [mobileSidebarOpen]);

  const handleOpenMobileSidebar = () => {
    setMobileSidebarOpen(true);
  };

  const handleCloseMobileSidebar = () => {
    setMobileSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex">
      {/* 1. Desktop Sidebar (Permanent) */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 md:left-0 z-10">
        <Sidebar />
      </div>

      {/* 2. Mobile Sidebar (Drawer with portal overlay) */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden flex">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300"
            onClick={handleCloseMobileSidebar}
            aria-hidden="true"
          />

          {/* Sliding drawer container */}
          <div className="relative flex flex-col w-full max-w-xs h-full bg-white dark:bg-slate-900 shadow-xl animate-slide-in">
            <Sidebar onClose={handleCloseMobileSidebar} />
          </div>
        </div>
      )}

      {/* 3. Main Content Container */}
      <div className="flex-1 flex flex-col md:pl-64 min-w-0">
        <Header onMenuClick={handleOpenMobileSidebar} />
        
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
