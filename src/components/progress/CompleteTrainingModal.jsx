import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Textarea from '../common/Textarea';
import Select from '../common/Select';
import Button from '../common/Button';
import ErrorMessage from '../common/ErrorMessage';
import { progressService } from '../../services/progress';

/**
 * Confirmation form for a mentor to finalize a trainee's placement and submit completion evaluation
 */
export default function CompleteTrainingModal({ isOpen, onClose, intern, onSuccess }) {
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [finalRemarks, setFinalRemarks] = useState('');
  const [finalRating, setFinalRating] = useState('');

  useEffect(() => {
    if (isOpen) {
      setErrorMsg('');
      setFinalRemarks('');
      setFinalRating('');
    }
  }, [isOpen]);

  if (!intern) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const trimmedRemarks = finalRemarks.trim();
    if (!trimmedRemarks) {
      setErrorMsg('Final remarks are required.');
      return;
    }

    const ratingVal = parseInt(finalRating, 10);
    if (isNaN(ratingVal) || ratingVal < 1 || ratingVal > 5) {
      setErrorMsg('Please select a valid final performance rating.');
      return;
    }

    setSubmitting(true);

    try {
      const response = await progressService.completeTraining(intern.id, {
        finalRemarks: trimmedRemarks,
        finalRating: ratingVal,
      });

      if (response && response.success !== false) {
        await onSuccess(intern.fullName);
        onClose();
      } else {
        throw new Error(response.error || 'Failed to process completion.');
      }
    } catch (err) {
      console.error('Failed to complete training:', err);
      // Support backend error response shape
      const backendMessage = err.response?.data?.error || err.response?.data?.message;
      if (backendMessage) {
        setErrorMsg(backendMessage);
      } else {
        setErrorMsg('Failed to process training completion. Please check connection and try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Complete Intern Training Evaluation"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
        {errorMsg && (
          <ErrorMessage
            title="Operation failed"
            message={errorMsg}
          />
        )}

        <p className="text-sm text-gray-600">
          You are finalizing the placement training program for{' '}
          <strong className="text-gray-900">{intern.fullName}</strong>.
        </p>

        <div className="bg-amber-50 border border-amber-250 text-amber-800 p-4 rounded-lg text-xs leading-relaxed">
          <strong className="block mb-1">Warning: Completing training will:</strong>
          <ul className="list-disc pl-4 space-y-1">
            <li>Change the intern status from <strong>Ongoing</strong> to <strong>Completed</strong>.</li>
            <li>Create the final 100% progress evaluation sheet.</li>
            <li>Remove the intern from your ongoing tracking portal list immediately.</li>
          </ul>
        </div>

        <Select
          id="finalRating"
          label="Final Performance Rating"
          options={[
            { value: '', label: 'Select final rating...' },
            { value: '1', label: '1 - Unsatisfactory' },
            { value: '2', label: '2 - Needs Improvement' },
            { value: '3', label: '3 - Satisfactory' },
            { value: '4', label: '4 - Very Good' },
            { value: '5', label: '5 - Outstanding' },
          ]}
          value={finalRating}
          onChange={(e) => setFinalRating(e.target.value)}
          disabled={submitting}
          required
        />

        <Textarea
          id="finalRemarks"
          label="Final Performance Remarks"
          placeholder="Provide a comprehensive summary of the intern's work, learning, and general performance during the training period..."
          value={finalRemarks}
          onChange={(e) => setFinalRemarks(e.target.value)}
          disabled={submitting}
          required
        />

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
          >
            Submit Evaluation
          </Button>
        </div>
      </form>
    </Modal>
  );
}
