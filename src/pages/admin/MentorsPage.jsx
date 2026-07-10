import React, { useState, useEffect } from 'react';
import { Plus, UserPlus, AlertCircle } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';

// Mentor specific components
import MentorTable from '../../components/mentors/MentorTable';
import MentorFormModal from '../../components/mentors/MentorFormModal';
import MentorStatusDialog from '../../components/mentors/MentorStatusDialog';

// API Service
import { mentorService } from '../../services/mentor';

/**
 * MentorsPage - Admin management portal for program mentors
 */
export default function MentorsPage() {
  const [mentors, setMentors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalMentors, setTotalMentors] = useState(0);

  // Loading & Error States
  const [loading, setLoading] = useState(true);
  const [listLoading, setListLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [actionError, setActionError] = useState('');

  // Modal / Dialog States
  const [formOpen, setFormOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState(null);

  // Fetch mentor dataset
  const fetchMentors = async (pageNumber = currentPage, isSilent = false) => {
    if (isSilent) {
      setListLoading(true);
      setActionError('');
    } else {
      setLoading(true);
      setErrorMsg('');
    }

    try {
      const response = await mentorService.getMentors(pageNumber, limit);
      if (response && response.success) {
        setMentors(response.data || []);
        
        // Map pagination response
        const pag = response.pagination || {};
        setCurrentPage(pag.page || pageNumber);
        setTotalPages(pag.pages || 1);
        setTotalMentors(pag.total || 0);
      } else {
        throw new Error('Failed to retrieve mentors');
      }
    } catch (err) {
      console.error('Failed to load mentors list:', err);
      const msg = err.response?.data?.message || 'A network error occurred. Please verify your connection.';
      
      if (isSilent) {
        setActionError(`Failed to update list: ${msg}`);
      } else {
        setErrorMsg(msg);
      }
    } finally {
      setLoading(false);
      setListLoading(false);
    }
  };

  useEffect(() => {
    fetchMentors(1, false);
  }, []);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages || listLoading) return;
    fetchMentors(newPage, true);
  };

  // Open modal in create mode
  const handleOpenCreate = () => {
    setSelectedMentor(null);
    setFormOpen(true);
  };

  // Open modal in edit mode
  const handleOpenEdit = (mentor) => {
    setSelectedMentor(mentor);
    setFormOpen(true);
  };

  // Open confirmation status toggle dialog
  const handleOpenStatus = (mentor) => {
    setSelectedMentor(mentor);
    setStatusOpen(true);
  };

  // Action callbacks
  const handleCreateSuccess = () => {
    // Reset to page 1 to see the newly created mentor at the top
    fetchMentors(1, false);
  };

  const handleUpdateSuccess = () => {
    // Refresh the current page to reflect changes
    fetchMentors(currentPage, true);
  };

  // 1. Initial Loading State
  if (loading && mentors.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner size="lg" label="Loading mentors list..." />
      </div>
    );
  }

  // 2. Initial List Fail
  if (errorMsg && mentors.length === 0) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center p-4">
        <ErrorMessage
          title="Failed to fetch mentors"
          message={errorMsg}
          onRetry={() => fetchMentors(1, false)}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <PageHeader
        title="Mentors Management"
        description="Configure accounts, view registration timelines, and authorize access for mentors."
        action={
          <Button
            variant="primary"
            icon={Plus}
            onClick={handleOpenCreate}
            disabled={listLoading}
          >
            Add Mentor
          </Button>
        }
      />

      {/* Non-destructive Alert Banner */}
      {actionError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between text-xs font-semibold shadow-xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
            <span>{actionError}</span>
          </div>
          <button
            onClick={() => setActionError('')}
            className="text-red-500 hover:text-red-800 font-bold focus:outline-none"
            aria-label="Dismiss message"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 3. Empty State Layout */}
      {mentors.length === 0 ? (
        <EmptyState
          title="No mentors registered"
          description="It looks like there are no mentor accounts created in the system yet."
          icon={UserPlus}
          action={
            <Button variant="primary" icon={Plus} onClick={handleOpenCreate}>
              Create First Mentor Account
            </Button>
          }
        />
      ) : (
        /* 4. Table Grid & Pagination Section */
        <div className={`flex flex-col gap-4 transition-opacity duration-200 ${listLoading ? 'opacity-60' : 'opacity-100'}`}>
          <MentorTable
            mentors={mentors}
            onEdit={handleOpenEdit}
            onToggleStatus={handleOpenStatus}
          />

          {/* Pagination Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-200 pt-4 mt-2 select-none">
            <span className="text-xs text-gray-500 font-medium">
              Showing page {currentPage} of {totalPages || 1} ({totalMentors} total mentors)
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                disabled={currentPage === 1 || listLoading}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                size="sm"
                disabled={currentPage >= totalPages || listLoading}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Form Drawer (Create / Edit Mode) */}
      <MentorFormModal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        mentor={selectedMentor}
        onSuccess={selectedMentor ? handleUpdateSuccess : handleCreateSuccess}
      />

      {/* Status Confirmation Modal */}
      <MentorStatusDialog
        isOpen={statusOpen}
        onClose={() => setStatusOpen(false)}
        mentor={selectedMentor}
        onSuccess={handleUpdateSuccess}
      />
    </div>
  );
}
