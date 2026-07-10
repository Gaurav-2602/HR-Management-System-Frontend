import React, { useState, useEffect } from 'react';
import { Award, BookOpen, Calendar, HelpCircle } from 'lucide-react';
import Modal from '../common/Modal';
import Spinner from '../common/Spinner';
import ErrorMessage from '../common/ErrorMessage';
import Badge from '../common/Badge';
import { getInternStatusLabel, getInternStatusVariant } from '../../utils/status';
import { formatDate } from '../../utils/dashboard';
import { internService } from '../../services/intern';

/**
 * Detailed modal view displaying read-only certificate metadata
 */
export default function CertificateDetailModal({ isOpen, onClose, internId }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    async function fetchIssuanceDetails() {
      if (!isOpen || !internId) return;

      setLoading(true);
      setErrorMsg('');
      setDetails(null);

      try {
        const response = await internService.getIssuanceDetails(internId);
        setDetails(response);
      } catch (err) {
        console.error('Failed to load issuance details:', err);
        setErrorMsg(err.response?.data?.error || 'Failed to retrieve certificate details.');
      } finally {
        setLoading(false);
      }
    }

    fetchIssuanceDetails();
  }, [isOpen, internId]);

  const renderValue = (val) => {
    if (val === undefined || val === null || String(val).trim() === '') {
      return <span className="text-gray-400 font-medium">—</span>;
    }
    return <span className="text-gray-900 font-semibold">{val}</span>;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Placement Certificate Details"
      maxWidthClass="max-w-2xl"
    >
      {loading && (
        <div className="py-12 flex items-center justify-center">
          <Spinner size="md" label="Loading certificate details..." />
        </div>
      )}

      {errorMsg && (
        <div className="py-6">
          <ErrorMessage
            title="Failed to retrieve record"
            message={errorMsg}
            onRetry={() => {
              setErrorMsg('');
              setLoading(true);
              internService
                .getIssuanceDetails(internId)
                .then((data) => {
                  setDetails(data);
                  setLoading(false);
                })
                .catch((err) => {
                  setErrorMsg(err.response?.data?.error || 'Failed to retrieve certificate details.');
                  setLoading(false);
                });
            }}
          />
        </div>
      )}

      {!loading && !errorMsg && details && (
        <div className="flex flex-col gap-6 text-left">
          {/* Certificate Reference Badge */}
          <div className="bg-amber-50 border border-amber-250 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-amber-100 border border-amber-200 text-amber-800 flex items-center justify-center shrink-0">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] text-amber-800 font-bold uppercase tracking-wider block">
                  Reference Code
                </span>
                <strong className="text-sm font-bold text-gray-900 font-mono">
                  {details.certificateNumber || '—'}
                </strong>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                Status:
              </span>
              <Badge variant={getInternStatusVariant(details.status)} dot>
                {getInternStatusLabel(details.status)}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Candidate Identity */}
            <div className="space-y-4">
              <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-100 pb-1.5">
                <Award className="h-3.5 w-3.5" /> Intern Identity
              </h5>
              <div className="grid grid-cols-1 gap-3 text-xs">
                <div className="flex flex-col">
                  <span className="text-gray-500">Full Name</span>
                  {renderValue(details.fullName)}
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-500">Intern ID Code</span>
                  {renderValue(details.internId)}
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-500">Email Address</span>
                  {renderValue(details.email)}
                </div>
              </div>
            </div>

            {/* Placement timelines */}
            <div className="space-y-4">
              <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-100 pb-1.5">
                <Calendar className="h-3.5 w-3.5" /> Placement Timelines
              </h5>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex flex-col col-span-2">
                  <span className="text-gray-500">Training Type</span>
                  {renderValue(details.trainingType)}
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-500">Start Date</span>
                  {renderValue(formatDate(details.startDate))}
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-500">End Date</span>
                  {renderValue(formatDate(details.endDate))}
                </div>
              </div>
            </div>
          </div>

          {/* Academic Background */}
          <div className="space-y-4 border-t border-gray-100 pt-4">
            <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-100 pb-1.5">
              <BookOpen className="h-3.5 w-3.5" /> Academic Information
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex flex-col">
                <span className="text-gray-500">Institute Name</span>
                {renderValue(details.instituteName)}
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500">Branch / Discipline</span>
                {renderValue(details.branch)}
              </div>
            </div>
          </div>

          {/* Certificate Issuance Details */}
          <div className="space-y-4 border-t border-gray-100 pt-4">
            <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-100 pb-1.5">
              <Award className="h-3.5 w-3.5" /> Administrative Issuance Details
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex flex-col">
                <span className="text-gray-500">Issued On Date</span>
                {renderValue(formatDate(details.issuedAt))}
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500">Issued By (Admin ID)</span>
                {renderValue(details.issuedBy)}
              </div>
              <div className="flex flex-col col-span-2 bg-slate-50 border border-gray-150 p-3 rounded-lg leading-relaxed mt-1">
                <span className="text-gray-500 font-medium block select-none mb-1">Final HR Remarks</span>
                {renderValue(details.finalHrRemarks)}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2 text-[10px] text-gray-400 border-t border-gray-100 pt-3 select-none">
            <HelpCircle className="h-3.5 w-3.5 text-gray-300 shrink-0 mt-0.5" />
            <span>
              This system does not support PDF rendering or digital certificate generation. This panel manages
              administrative reference logs for physical certificate tracking only.
            </span>
          </div>
        </div>
      )}
    </Modal>
  );
}
