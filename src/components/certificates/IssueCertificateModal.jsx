import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Textarea from '../common/Textarea';
import Button from '../common/Button';
import ErrorMessage from '../common/ErrorMessage';
import { internService } from '../../services/intern';

/**
 * Modal form for HR Admin to issue a certificate to a completed intern
 */
export default function IssueCertificateModal({ isOpen, onClose, intern, onSuccess }) {
  const [certificateNumber, setCertificateNumber] = useState('');
  const [finalHrRemarks, setFinalHrRemarks] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      setCertificateNumber('');
      setFinalHrRemarks('');
      setErrorMsg('');
    }
  }, [isOpen]);

  if (!intern) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const trimmedCertNumber = certificateNumber.trim();
    if (!trimmedCertNumber) {
      setErrorMsg('Certificate number is required.');
      return;
    }

    if (trimmedCertNumber.length > 50) {
      setErrorMsg('Certificate number cannot exceed 50 characters.');
      return;
    }

    const trimmedRemarks = finalHrRemarks.trim();
    if (trimmedRemarks.length > 500) {
      setErrorMsg('Final HR remarks cannot exceed 500 characters.');
      return;
    }

    setSubmitting(true);

    const payload = {
      certificateNumber: trimmedCertNumber,
    };

    if (trimmedRemarks) {
      payload.finalHrRemarks = trimmedRemarks;
    }

    try {
      const response = await internService.issueCertificate(intern.id, payload);

      if (response && response.success !== false) {
        await onSuccess();
        onClose();
      } else {
        throw new Error(response.error || 'Failed to issue certificate.');
      }
    } catch (err) {
      console.error('Certificate issuance failed:', err);
      // Support backend error response shape
      const backendMessage = err.response?.data?.error || err.response?.data?.message;
      if (backendMessage) {
        setErrorMsg(backendMessage);
      } else {
        setErrorMsg('Failed to process certificate. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Issue Placement Certificate"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
        {errorMsg && (
          <ErrorMessage
            title="Issuance failed"
            message={errorMsg}
          />
        )}

        {/* Trainee Context Panel */}
        <div className="bg-slate-50 border border-gray-150 p-4 rounded-xl text-xs space-y-2 select-none">
          <div className="font-semibold text-gray-500 uppercase tracking-wider">Trainee Context</div>
          <div className="grid grid-cols-2 gap-2 text-gray-700">
            <div>
              <span className="text-gray-400 font-medium">Full Name:</span>{' '}
              <strong className="text-gray-900">{intern.fullName}</strong>
            </div>
            <div>
              <span className="text-gray-400 font-medium">Intern ID:</span>{' '}
              <strong className="text-gray-900 font-mono">{intern.internId}</strong>
            </div>
            <div>
              <span className="text-gray-400 font-medium">Email:</span>{' '}
              <strong className="text-gray-900">{intern.email}</strong>
            </div>
            <div>
              <span className="text-gray-400 font-medium">Course Type:</span>{' '}
              <strong className="text-gray-900">{intern.trainingType}</strong>
            </div>
            <div className="col-span-2">
              <span className="text-gray-400 font-medium">Discipline:</span>{' '}
              <strong className="text-gray-900">{intern.branch}</strong>
            </div>
          </div>
        </div>

        <Input
          id="certificateNumber"
          type="text"
          label="Certificate Reference Number"
          placeholder="e.g. CERT-2026-0001"
          maxLength={50}
          required
          value={certificateNumber}
          onChange={(e) => setCertificateNumber(e.target.value)}
          disabled={submitting}
        />

        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="finalHrRemarks" className="text-xs font-semibold text-gray-700">
              Final HR Remarks (Optional)
            </label>
            <span className="text-[10px] text-gray-400 font-semibold select-none">
              {finalHrRemarks.trim().length}/500
            </span>
          </div>
          <Textarea
            id="finalHrRemarks"
            placeholder="Add any administrative remarks or feedback for records..."
            maxLength={500}
            value={finalHrRemarks}
            onChange={(e) => setFinalHrRemarks(e.target.value)}
            disabled={submitting}
          />
        </div>

        <div className="flex justify-end gap-3 mt-4 border-t border-gray-100 pt-4">
          <Button
            variant="secondary"
            disabled={submitting}
            onClick={onClose}
            type="button"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={submitting}
            disabled={!certificateNumber.trim() || submitting}
          >
            Issue Certificate
          </Button>
        </div>
      </form>
    </Modal>
  );
}
