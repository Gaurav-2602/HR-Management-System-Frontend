import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';

// Ongoing intern components
import OngoingInternsTable from '../../components/progress/OngoingInternsTable';
import OngoingInternDetailModal from '../../components/progress/OngoingInternDetailModal';
import RecordProgressModal from '../../components/progress/RecordProgressModal';
import ProgressHistoryModal from '../../components/progress/ProgressHistoryModal';
import CompleteTrainingModal from '../../components/progress/CompleteTrainingModal';

// API Service
import { progressService } from '../../services/progress';

/**
 * OngoingInternsPage - Mentor portal to track trainee progress and finalize training evaluations
 */
export default function OngoingInternsPage() {
  const [interns, setInterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Success / Error Alerts
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Modal Triggers
  const [detailOpen, setDetailOpen] = useState(false);
  const [recordOpen, setRecordOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [completeOpen, setCompleteOpen] = useState(false);

  const [selectedInternId, setSelectedInternId] = useState(null);
  const [selectedIntern, setSelectedIntern] = useState(null);

  const fetchOngoingInterns = async (isSilent = false) => {
    if (isSilent) {
      setRefreshing(true);
      setSuccessMsg('');
    } else {
      setLoading(true);
      setErrorMsg('');
      setSuccessMsg('');
    }

    try {
      const response = await progressService.getOngoingInterns();
      setInterns(response.data || []);
    } catch (err) {
      console.error('Failed to fetch ongoing interns:', err);
      const msg = err.response?.data?.error || err.response?.data?.message || 'A connection error occurred. Please verify your network.';
      
      if (isSilent) {
        setErrorMsg(`Refresh failed: ${msg}`);
      } else {
        setErrorMsg(msg);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOngoingInterns(false);
  }, []);

  const handleManualRefresh = () => {
    fetchOngoingInterns(true);
  };

  // View Details trigger
  const handleViewDetails = (id) => {
    setSelectedInternId(id);
    setDetailOpen(true);
  };

  // Record Progress trigger
  const handleRecordProgress = (intern) => {
    setSelectedIntern(intern);
    setRecordOpen(true);
  };

  // View History trigger
  const handleViewHistory = (intern) => {
    setSelectedIntern(intern);
    setHistoryOpen(true);
  };

  // Complete Training trigger
  const handleCompleteTraining = (intern) => {
    setSelectedIntern(intern);
    setCompleteOpen(true);
  };

  // Mutation successes callbacks
  const handleProgressSuccess = () => {
    setSuccessMsg('Progress update recorded successfully.');
    fetchOngoingInterns(true);
  };

  const handleCompleteSuccess = (name) => {
    setSuccessMsg(`Training evaluation completed successfully for ${name}.`);
    fetchOngoingInterns(true);
  };

  // 1. Initial Load spinner
  if (loading && interns.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner size="lg" label="Loading ongoing interns list..." />
      </div>
    );
  }

  // 2. Initial Fetch Failure
  if (errorMsg && interns.length === 0) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center p-4">
        <ErrorMessage
          title="Failed to fetch ongoing interns"
          message={errorMsg}
          onRetry={() => fetchOngoingInterns(false)}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <PageHeader
        title="Ongoing Interns"
        description="Track intern progress, review training history, and complete training evaluations."
        action={
          <Button
            variant="secondary"
            icon={RefreshCw}
            onClick={handleManualRefresh}
            disabled={refreshing}
            className={refreshing ? 'animate-spin' : ''}
          >
            Refresh
          </Button>
        }
      />

      {/* Success alert banner */}
      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-250 text-emerald-800 px-4 py-3 rounded-lg flex items-center justify-between text-xs font-semibold shadow-xs text-left select-none">
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

      {/* Background refresh error */}
      {refreshing && errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between text-xs font-semibold shadow-xs text-left select-none">
          <span>{errorMsg}</span>
          <button
            onClick={() => setErrorMsg('')}
            className="text-red-500 hover:text-red-800 font-bold focus:outline-none"
            aria-label="Dismiss error"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 3. Empty State */}
      {interns.length === 0 ? (
        <EmptyState
          title="No ongoing interns"
          description="No ongoing interns are currently assigned to you."
        />
      ) : (
        /* 4. Table Grid List */
        <div className={`transition-opacity duration-200 ${refreshing ? 'opacity-60' : 'opacity-100'}`}>
          <OngoingInternsTable
            interns={interns}
            onViewDetails={handleViewDetails}
            onRecordProgress={handleRecordProgress}
            onViewHistory={handleViewHistory}
            onCompleteTraining={handleCompleteTraining}
          />
        </div>
      )}

      {/* Ongoing Intern Details Modal */}
      <OngoingInternDetailModal
        isOpen={detailOpen}
        onClose={() => setDetailOpen(false)}
        internId={selectedInternId}
      />

      {/* Record Progress Form Modal */}
      <RecordProgressModal
        isOpen={recordOpen}
        onClose={() => setRecordOpen(false)}
        intern={selectedIntern}
        onSuccess={handleProgressSuccess}
      />

      {/* Progress History Timeline Modal */}
      <ProgressHistoryModal
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        intern={selectedIntern}
      />

      {/* Complete Training Modal Form */}
      <CompleteTrainingModal
        isOpen={completeOpen}
        onClose={() => setCompleteOpen(false)}
        intern={selectedIntern}
        onSuccess={handleCompleteSuccess}
      />
    </div>
  );
}
