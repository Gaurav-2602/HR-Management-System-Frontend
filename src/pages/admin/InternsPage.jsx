import React, { useState, useEffect } from 'react';
import { Plus, Search, X, Users, UserPlus, AlertCircle } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';

// Intern components
import InternTable from '../../components/interns/InternTable';
import InternDetailModal from '../../components/interns/InternDetailModal';
import InternFormModal from '../../components/interns/InternFormModal';
import InternDeleteDialog from '../../components/interns/InternDeleteDialog';

// API Service
import { internService } from '../../services/intern';

/**
 * InternsPage - Administrative view for managing interns list and profile workflows
 */
export default function InternsPage() {
  const [interns, setInterns] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  // Search & Filter state
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Loading & Error states
  const [loading, setLoading] = useState(true);
  const [listLoading, setListLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [actionError, setActionError] = useState('');

  // Modal Overlay states
  const [detailOpen, setDetailOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedInternId, setSelectedInternId] = useState(null);
  const [selectedIntern, setSelectedIntern] = useState(null);

  // 1. Debounce Search Input
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchQuery(searchInput.trim());
      setCurrentPage(1); // Reset page to 1 on search change
    }, 400); // 400ms debounce
    return () => clearTimeout(handler);
  }, [searchInput]);

  // 2. Fetch Interns List
  const fetchInterns = async (pageNumber = currentPage, isSilent = false) => {
    if (isSilent) {
      setListLoading(true);
      setActionError('');
    } else {
      setLoading(true);
      setErrorMsg('');
    }

    try {
      const response = await internService.getInterns({
        page: pageNumber,
        limit,
        status: statusFilter,
        search: searchQuery,
      });

      if (response && response.data) {
        setInterns(response.data);
        
        // Map pagination response
        const pag = response.pagination || {};
        setCurrentPage(pag.currentPage || pageNumber);
        setTotalPages(pag.totalPages || 1);
        setTotalRecords(pag.totalRecords || 0);
      } else {
        throw new Error('Failed to retrieve interns list');
      }
    } catch (err) {
      console.error('Failed to load interns:', err);
      const msg = err.response?.data?.error || err.response?.data?.message || 'A network error occurred. Please verify your connection.';
      
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

  // Re-fetch on query parameter changes
  useEffect(() => {
    fetchInterns(1, false);
  }, [searchQuery, statusFilter]);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages || listLoading) return;
    fetchInterns(newPage, true);
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchInput('');
    setSearchQuery('');
    setStatusFilter('ALL');
    setCurrentPage(1);
  };

  // Action toggles
  const handleOpenCreate = () => {
    setSelectedInternId(null);
    setFormOpen(true);
  };

  const handleOpenEdit = (intern) => {
    setSelectedInternId(intern.id);
    setFormOpen(true);
  };

  const handleOpenView = (intern) => {
    setSelectedInternId(intern.id);
    setDetailOpen(true);
  };

  const handleOpenDelete = (intern) => {
    setSelectedIntern(intern);
    setDeleteOpen(true);
  };

  // Success callbacks
  const handleCreateSuccess = () => {
    // Reset status filter to see NEW, go to page 1
    setStatusFilter('ALL');
    setSearchInput('');
    setSearchQuery('');
    fetchInterns(1, false);
  };

  const handleUpdateSuccess = () => {
    // Refresh current page
    fetchInterns(currentPage, true);
  };

  const handleDeleteSuccess = () => {
    // If the last item on the page was deleted, move to the previous page
    const isLastItem = interns.length === 1;
    const targetPage = isLastItem && currentPage > 1 ? currentPage - 1 : currentPage;
    fetchInterns(targetPage, false);
  };

  // Initial loading spinner
  if (loading && interns.length === 0 && searchQuery === '' && statusFilter === 'ALL') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner size="lg" label="Loading interns directory..." />
      </div>
    );
  }

  // Initial Load Fail
  if (errorMsg && interns.length === 0 && searchQuery === '' && statusFilter === 'ALL') {
    return (
      <div className="min-h-[50vh] flex items-center justify-center p-4">
        <ErrorMessage
          title="Failed to fetch interns"
          message={errorMsg}
          onRetry={() => fetchInterns(1, false)}
        />
      </div>
    );
  }

  const isFiltered = searchQuery !== '' || statusFilter !== 'ALL';

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <PageHeader
        title="Interns Management"
        description="Register trainees, oversee placement details, and manage onboarding documents."
        action={
          <Button
            variant="primary"
            icon={Plus}
            onClick={handleOpenCreate}
            disabled={listLoading}
          >
            Add Intern
          </Button>
        }
      />

      {/* Non-destructive Error Banner */}
      {actionError && (
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg flex items-center justify-between text-xs font-semibold shadow-xs">
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

      {/* Filters & Search Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 p-4 rounded-xl shadow-xs text-left select-none">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          {/* Debounced Search */}
          <div className="relative w-full sm:w-80">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              placeholder="Search by ID, name, email, institute, or branch"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              disabled={listLoading}
              className="w-full pl-9 pr-8 py-2 border border-gray-300 dark:border-slate-700 rounded-lg text-xs font-medium bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
            {searchInput && (
              <button
                onClick={() => setSearchInput('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Server-side Status Filter */}
          <div className="w-full sm:w-56">
            <select
              value={statusFilter}
              onChange={handleStatusChange}
              disabled={listLoading}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            >
              <option value="ALL" className="bg-white dark:bg-slate-800 text-gray-900 dark:text-white">All Workflow Statuses</option>
              <option value="NEW" className="bg-white dark:bg-slate-800 text-gray-900 dark:text-white">New</option>
              <option value="ASSIGNED" className="bg-white dark:bg-slate-800 text-gray-900 dark:text-white">Assigned</option>
              <option value="REJECTED_BY_MENTOR" className="bg-white dark:bg-slate-800 text-gray-900 dark:text-white">Rejected by Mentor</option>
              <option value="ONGOING" className="bg-white dark:bg-slate-800 text-gray-900 dark:text-white">Ongoing</option>
              <option value="COMPLETED" className="bg-white dark:bg-slate-800 text-gray-900 dark:text-white">Completed</option>
              <option value="ISSUED" className="bg-white dark:bg-slate-800 text-gray-900 dark:text-white">Issued</option>
            </select>
          </div>
        </div>

        {/* Clear Filters CTA */}
        {isFiltered && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            disabled={listLoading}
            className="text-indigo-600 dark:text-indigo-450 hover:bg-indigo-50 dark:hover:bg-indigo-950/20"
          >
            Clear Filters
          </Button>
        )}
      </div>

      {/* 5. Main Content Area */}
      {interns.length === 0 ? (
        isFiltered ? (
          /* Empty results for filter queries */
          <EmptyState
            title="No matching interns found"
            description="Adjust your search criteria or reset filters to view all trainee records."
            action={
              <Button variant="secondary" onClick={handleClearFilters}>
                Reset Search Filters
              </Button>
            }
          />
        ) : (
          /* Real empty directory */
          <EmptyState
            title="No interns registered"
            description="It looks like there are no active intern profiles registered in the system yet."
            icon={UserPlus}
            action={
              <Button variant="primary" icon={Plus} onClick={handleOpenCreate}>
                Register First Intern Profile
              </Button>
            }
          />
        )
      ) : (
        /* Tabular list & pagination section */
        <div className={`flex flex-col gap-4 transition-opacity duration-200 ${listLoading ? 'opacity-60' : 'opacity-100'}`}>
          <InternTable
            interns={interns}
            onView={handleOpenView}
            onEdit={handleOpenEdit}
            onDelete={handleOpenDelete}
          />

          {/* Pagination Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-200 pt-4 mt-2 select-none">
            <span className="text-xs text-gray-500 font-medium">
              Showing page {currentPage} of {totalPages || 1} ({totalRecords} total interns matching)
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

      {/* Detail Profile Drawer */}
      <InternDetailModal
        isOpen={detailOpen}
        onClose={() => setDetailOpen(false)}
        internId={selectedInternId}
      />

      {/* Form Drawer (Create / Edit) */}
      <InternFormModal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        internId={selectedInternId}
        onSuccess={selectedInternId ? handleUpdateSuccess : handleCreateSuccess}
      />

      {/* Delete Confirmation Modal */}
      <InternDeleteDialog
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        intern={selectedIntern}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  );
}
