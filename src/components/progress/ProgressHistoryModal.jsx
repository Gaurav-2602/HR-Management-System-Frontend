import React, { useState, useEffect } from 'react';
import { Award, Calendar, CheckCircle2, Star } from 'lucide-react';
import Modal from '../common/Modal';
import Spinner from '../common/Spinner';
import ErrorMessage from '../common/ErrorMessage';
import EmptyState from '../common/EmptyState';
import { formatDate } from '../../utils/dashboard';
import { progressService } from '../../services/progress';

/**
 * Timeline modal displaying the chronological progress updates for a single trainee
 */
export default function ProgressHistoryModal({ isOpen, onClose, intern }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    async function fetchHistory() {
      if (!isOpen || !intern) return;

      setLoading(true);
      setErrorMsg('');
      setHistory([]);

      try {
        const response = await progressService.getProgressHistory(intern.id);
        // Backend returns chronological oldest-to-newest history, which matches our requirements
        setHistory(response.data || []);
      } catch (err) {
        console.error('Failed to load progress history:', err);
        setErrorMsg(err.response?.data?.error || 'Failed to retrieve progress timeline.');
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, [isOpen, intern]);

  if (!intern) return null;

  const renderStars = (rating) => {
    if (!rating) return null;
    return (
      <div className="flex items-center gap-0.5" title={`Rating: ${rating}/5`}>
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-3 w-3 shrink-0 ${
              i < rating ? 'text-amber-500 fill-amber-500' : 'text-gray-200 dark:text-slate-700'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Progress History"
      maxWidthClass="max-w-xl"
    >
      {loading && (
        <div className="py-12 flex items-center justify-center">
          <Spinner size="md" label="Loading progress history..." />
        </div>
      )}

      {errorMsg && (
        <div className="py-6">
          <ErrorMessage
            title="Unable to load history"
            message={errorMsg}
            onRetry={() => {
              setErrorMsg('');
              setLoading(true);
              progressService
                .getProgressHistory(intern.id)
                .then((res) => {
                  setHistory(res.data || []);
                  setLoading(false);
                })
                .catch((err) => {
                  setErrorMsg(err.response?.data?.error || 'Failed to retrieve progress timeline.');
                  setLoading(false);
                });
            }}
          />
        </div>
      )}

      {!loading && !errorMsg && history.length === 0 && (
        <div className="py-4">
          <EmptyState
            title="No progress recorded yet"
            description={`There are no historical updates recorded for ${intern.fullName} under the current assignment.`}
          />
        </div>
      )}

      {!loading && !errorMsg && history.length > 0 && (
        <div className="flex flex-col gap-4 text-left max-h-[60vh] overflow-y-auto pr-1">
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider mb-2 select-none border-b border-gray-150 dark:border-slate-800 pb-1">
            Chronological log of placement updates: {intern.fullName}
          </p>

          <div className="flex flex-col gap-4">
            {history.map((record, index) => {
              const isFinal = record.isFinal === true;
              
              return (
                <div
                  key={record.id}
                  className={`border rounded-xl p-4 shadow-xs flex flex-col gap-2.5 transition-colors
                    ${
                      isFinal
                        ? 'border-amber-250 dark:border-amber-900/50 bg-amber-50/10 dark:bg-amber-950/10'
                        : 'border-gray-200 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                    }
                  `}
                >
                  {/* Title / Header */}
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-900 dark:text-white font-mono">
                        {record.progressPercentage}%
                      </span>
                      {isFinal && (
                        <span className="bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-400 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider flex items-center gap-1 animate-pulse">
                          <Award className="h-3 w-3" /> Final Evaluation
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-gray-400 dark:text-gray-505 select-none font-semibold">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(record.recordedAt)}</span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-gray-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden select-none">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isFinal ? 'bg-amber-500' : 'bg-indigo-600'
                      }`}
                      style={{ width: `${record.progressPercentage}%` }}
                    />
                  </div>

                  {/* Remarks */}
                  <p className="text-xs text-gray-700 dark:text-gray-300 font-medium break-words mt-1 leading-relaxed">
                    {record.remarks}
                  </p>

                  {/* Rating / Disclosures footer */}
                  {(record.performanceRating || record.nextGoals || (record.skillsCovered && record.skillsCovered.length > 0)) && (
                    <div className="border-t border-gray-100/80 dark:border-slate-800 pt-2.5 flex flex-col gap-2 mt-0.5">
                      {record.performanceRating && (
                        <div className="flex items-center gap-2 text-[10px] text-gray-400">
                          <span className="font-semibold uppercase tracking-wider">Evaluation Rating:</span>
                          {renderStars(record.performanceRating)}
                        </div>
                      )}

                      {record.skillsCovered && record.skillsCovered.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mr-1">Skills:</span>
                          {record.skillsCovered.map((skill, sIdx) => (
                            <span
                              key={sIdx}
                              className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] px-1.5 py-0.5 rounded-md font-semibold select-none"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}

                      {record.nextGoals && (
                        <div className="text-[11px] text-gray-600 dark:text-gray-305 bg-slate-50/60 dark:bg-slate-800/40 p-2 rounded-lg leading-snug border border-slate-100 dark:border-slate-800">
                          <strong className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider block mb-0.5 select-none">
                            Next Goals / Directives
                          </strong>
                          {record.nextGoals}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Modal>
  );
}
