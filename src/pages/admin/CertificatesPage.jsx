import React, { useState, useEffect } from 'react';
import { Award, Search, X, ShieldAlert, Award as AwardIcon, Eye } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';
import Badge from '../../components/common/Badge';

// Certificate modals
import IssueCertificateModal from '../../components/certificates/IssueCertificateModal';
import CertificateDetailModal from '../../components/certificates/CertificateDetailModal';

// Status Helpers
import { getInternStatusLabel, getInternStatusVariant } from '../../utils/status';
import { formatDate } from '../../utils/dashboard';
import { internService } from '../../services/intern';

/**
 * HR Admin portal for managing and issuing placement certificates
 */
export default function CertificatesPage() {
  const [activeTab, setActiveTab] = useState('COMPLETED'); // 'COMPLETED' (Ready to Issue) | 'ISSUED' (Issued)
  
  const [interns, setInterns] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  // Search filter
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Loading & Error states
  const [loading, setLoading] = useState(true);
  const [listLoading, setListLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Modal triggers
  const [issueOpen, setIssueOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedIntern, setSelectedIntern] = useState(null);
  const [selectedInternId, setSelectedInternId] = useState(null);

  // 1. Debounce Search Input
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchQuery(searchInput.trim());
      setCurrentPage(1); // Reset to page 1 on search change
    }, 400);
    return () => clearTimeout(handler);
  }, [searchInput]);

  // Reset page and search when changing tabs
  useEffect(() => {
    setSearchInput('');
    setSearchQuery('');
    setCurrentPage(1);
    setSuccessMsg('');
  }, [activeTab]);

  // 2. Fetch Interns List
  const fetchInterns = async (pageNumber = currentPage, isSilent = false) => {
    if (isSilent) {
      setListLoading(true);
      setErrorMsg('');
    } else {
      setLoading(true);
      setErrorMsg('');
    }

    try {
      const response = await internService.getInterns({
        page: pageNumber,
        limit,
        status: activeTab,
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
        throw new Error('Failed to retrieve list data');
      }
    } catch (err) {
      console.error('Failed to load interns:', err);
      const msg = err.response?.data?.error || err.response?.data?.message || 'A network error occurred. Please verify your connection.';
      
      if (isSilent) {
        setErrorMsg(`Refresh failed: ${msg}`);
      } else {
        setErrorMsg(msg);
      }
    } finally {
      setLoading(false);
      setListLoading(false);
    }
  };

  // Re-fetch on query changes
  useEffect(() => {
    fetchInterns(1, false);
  }, [activeTab, searchQuery]);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages || listLoading) return;
    fetchInterns(newPage, true);
  };

  // Modal Actions triggers
  const handleOpenIssue = (intern) => {
    setSelectedIntern(intern);
    setIssueOpen(true);
  };

  const handleOpenView = (intern) => {
    setSelectedInternId(intern.id);
    setDetailOpen(true);
  };

  const handleIssuanceSuccess = () => {
    setSuccessMsg('Certificate issued successfully.');
    
    // If the last item on the page was issued, move to previous page
    const isLastItem = interns.length === 1;
    const targetPage = isLastItem && currentPage > 1 ? currentPage - 1 : currentPage;
    fetchInterns(targetPage, false);
  };

  // Initial spinner
  if (loading && interns.length === 0 && searchQuery === '') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner size="lg" label="Loading certificate data..." />
      </div>
    );
  }

  // Initial Fail
  if (errorMsg && interns.length === 0 && searchQuery === '') {
    return (
      <div className="min-h-[50vh] flex items-center justify-center p-4">
        <ErrorMessage
          title="Failed to fetch records"
          message={errorMsg}
          onRetry={() => fetchInterns(1, false)}
        />
      </div>
    );
  }

  const isFiltered = searchQuery !== '';

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <PageHeader
        title="Certificates"
        description="Issue certificates to completed interns and review issued certificate records."
      />

      {/* Success Alert Banner */}
      {successMsg && (
        <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-250 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-400 px-4 py-3 rounded-lg flex items-center justify-between text-xs font-semibold shadow-xs text-left select-none">
          <span>{successMsg}</span>
          <button
            onClick={() => setSuccessMsg('')}
            className="text-emerald-600 hover:text-emerald-800 font-bold focus:outline-none"
            aria-label="Dismiss banner"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Tabs Row */}
      <div className="border-b border-gray-200 dark:border-slate-800 flex gap-2 overflow-x-auto select-none pb-0.5">
        <button
          type="button"
          onClick={() => setActiveTab('COMPLETED')}
          disabled={listLoading}
          className={`py-2.5 px-4 text-xs font-semibold border-b-2 whitespace-nowrap outline-none focus:ring-2 focus:ring-indigo-500/20 rounded-t transition-colors
            ${
              activeTab === 'COMPLETED'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-indigo-50/20 dark:bg-indigo-950/20'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/40'
            }
          `}
        >
          Ready to Issue
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('ISSUED')}
          disabled={listLoading}
          className={`py-2.5 px-4 text-xs font-semibold border-b-2 whitespace-nowrap outline-none focus:ring-2 focus:ring-indigo-500/20 rounded-t transition-colors
            ${
              activeTab === 'ISSUED'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-indigo-50/20 dark:bg-indigo-950/20'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/40'
            }
          `}
        >
          Issued Certificates
        </button>
      </div>

      {/* Search Input Filter */}
      <div className="flex items-center gap-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 p-4 rounded-xl shadow-xs text-left select-none">
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
      </div>

      {/* List Grids */}
      {interns.length === 0 ? (
        isFiltered ? (
          <EmptyState
            title="No matching interns found"
            description="Adjust your search criteria to find registered placement records."
            action={
              <Button variant="secondary" onClick={() => setSearchInput('')}>
                Reset Search
              </Button>
            }
          />
        ) : (
          <EmptyState
            title={activeTab === 'COMPLETED' ? 'No completed interns' : 'No issued certificates'}
            description={
              activeTab === 'COMPLETED'
                ? 'No completed interns are waiting for certificate issuance.'
                : 'No certificates have been issued yet.'
            }
            icon={AwardIcon}
          />
        )
      ) : (
        <div className={`flex flex-col gap-4 transition-opacity duration-200 ${listLoading ? 'opacity-60' : 'opacity-100'}`}>
          <div className="overflow-x-auto w-full border border-gray-200 rounded-xl bg-white shadow-xs">
            <table className="w-full text-left text-sm border-collapse min-w-[900px]">
              <thead>
                <tr className="border-b border-gray-200 bg-slate-50 text-gray-500 font-semibold select-none">
                  <th className="px-6 py-4">Intern</th>
                  <th className="px-6 py-4">Branch</th>
                  <th className="px-6 py-4">Training Type</th>
                  <th className="px-6 py-4">Timeline</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {interns.map((intern) => (
                  <tr key={intern.id} className="hover:bg-slate-50/50 transition-colors">
                    {/* Intern */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col text-left">
                        <span className="font-semibold text-gray-900">{intern.fullName}</span>
                        <span className="text-[10px] text-gray-500 font-mono mt-0.5">{intern.internId}</span>
                      </div>
                    </td>
                    {/* Branch */}
                    <td className="px-6 py-4 text-gray-600">{intern.branch}</td>
                    {/* Training Type */}
                    <td className="px-6 py-4 text-gray-600 font-medium">{intern.trainingType}</td>
                    {/* Timeline */}
                    <td className="px-6 py-4 text-gray-500">
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
                      {activeTab === 'COMPLETED' ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={Award}
                          onClick={() => handleOpenIssue(intern)}
                          aria-label={`Issue certificate to ${intern.fullName}`}
                        >
                          Issue Certificate
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={Eye}
                          onClick={() => handleOpenView(intern)}
                          aria-label={`View certificate details of ${intern.fullName}`}
                        >
                          View Details
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-200 pt-4 mt-2 select-none">
            <span className="text-xs text-gray-500 font-medium">
              Showing page {currentPage} of {totalPages || 1} ({totalRecords} matching interns)
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

      {/* Issue Certificate Form modal */}
      <IssueCertificateModal
        isOpen={issueOpen}
        onClose={() => setIssueOpen(false)}
        intern={selectedIntern}
        onSuccess={handleIssuanceSuccess}
      />

      {/* Certificate Details Modal */}
      <CertificateDetailModal
        isOpen={detailOpen}
        onClose={() => setDetailOpen(false)}
        internId={selectedInternId}
      />
    </div>
  );
}
