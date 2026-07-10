import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import ErrorMessage from '../common/ErrorMessage';
import { mentorService } from '../../services/mentor';

/**
 * Confirmation dialog for activating and deactivating mentor accounts
 */
export default function MentorStatusDialog({ isOpen, onClose, mentor, onSuccess }) {
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      setErrorMsg('');
    }
  }, [isOpen]);

  if (!mentor) return null;

  const currentStatus = mentor.isActive;
  const targetStatus = !currentStatus;

  const handleConfirm = async () => {
    setErrorMsg('');
    setSubmitting(true);

    try {
      await mentorService.updateMentorStatus(mentor.id, targetStatus);
      await onSuccess();
      onClose();
    } catch (err) {
      console.error('Failed to toggle mentor status:', err);
      // Support backend error response shape
      const backendMessage = err.response?.data?.message;
      if (backendMessage) {
        setErrorMsg(backendMessage);
      } else {
        setErrorMsg('An unexpected error occurred. Please verify connection and try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={currentStatus ? 'Deactivate Mentor Account' : 'Activate Mentor Account'}
    >
      <div className="flex flex-col gap-4 text-left">
        {errorMsg && (
          <ErrorMessage
            title="Action failed"
            message={errorMsg}
          />
        )}

        <p className="text-sm text-gray-600">
          Are you sure you want to {currentStatus ? 'deactivate' : 'activate'} the account for{' '}
          <strong className="text-gray-900">{mentor.fullName}</strong>?
        </p>

        {currentStatus ? (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-lg text-xs leading-relaxed">
            <strong>Warning:</strong> Deactivating this account will prevent{' '}
            <strong>{mentor.fullName}</strong> from logging into the portal immediately. Active tasks
            and historical evaluations under their name will not be deleted.
          </div>
        ) : (
          <div className="bg-emerald-50 border border-emerald-250 text-emerald-800 p-3 rounded-lg text-xs leading-relaxed">
            <strong>Note:</strong> Activating this account will restore full login access for{' '}
            <strong>{mentor.fullName}</strong> immediately.
          </div>
        )}

        <div className="flex items-center justify-between text-xs border border-gray-100 rounded-lg p-3 bg-slate-50 mt-2">
          <span className="text-gray-500 font-medium">Status Change</span>
          <div className="flex items-center gap-2 font-semibold">
            <span className={currentStatus ? 'text-emerald-700' : 'text-rose-700'}>
              {currentStatus ? 'Active' : 'Inactive'}
            </span>
            <span className="text-gray-400">→</span>
            <span className={targetStatus ? 'text-emerald-700' : 'text-rose-700'}>
              {targetStatus ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-4 border-t border-gray-100 pt-4">
          <Button
            variant="secondary"
            disabled={submitting}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant={currentStatus ? 'danger' : 'primary'}
            loading={submitting}
            onClick={handleConfirm}
          >
            {currentStatus ? 'Deactivate Account' : 'Activate Account'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
