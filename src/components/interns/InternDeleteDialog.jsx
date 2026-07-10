import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import ErrorMessage from '../common/ErrorMessage';
import { internService } from '../../services/intern';

/**
 * Confirmation dialog for soft-deleting an intern
 */
export default function InternDeleteDialog({ isOpen, onClose, intern, onSuccess }) {
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      setErrorMsg('');
    }
  }, [isOpen]);

  if (!intern) return null;

  const handleConfirm = async () => {
    setErrorMsg('');
    setSubmitting(true);

    try {
      await internService.deleteIntern(intern.id);
      await onSuccess();
      onClose();
    } catch (err) {
      console.error('Failed to soft-delete intern:', err);
      // Support backend error response shape
      const backendMessage = err.response?.data?.error || err.response?.data?.message;
      if (backendMessage) {
        setErrorMsg(backendMessage);
      } else {
        setErrorMsg('Failed to process deletion. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Intern Record"
    >
      <div className="flex flex-col gap-4 text-left">
        {errorMsg && (
          <ErrorMessage
            title="Action failed"
            message={errorMsg}
          />
        )}

        <p className="text-sm text-gray-600 leading-relaxed">
          Are you sure you want to delete the record for{' '}
          <strong className="text-gray-900">{intern.fullName}</strong> (ID:{' '}
          <span className="font-mono font-bold text-gray-800">{intern.internId}</span>)?
        </p>

        <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-lg text-xs leading-relaxed">
          <strong>Crucial Note:</strong> This action removes the intern from active operational records and
          listings. This operation cannot be reversed from the current administrative portal.
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
            variant="danger"
            loading={submitting}
            onClick={handleConfirm}
          >
            Delete Record
          </Button>
        </div>
      </div>
    </Modal>
  );
}
