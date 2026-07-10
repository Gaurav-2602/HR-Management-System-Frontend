import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Textarea from '../common/Textarea';
import Select from '../common/Select';
import Button from '../common/Button';
import Spinner from '../common/Spinner';
import ErrorMessage from '../common/ErrorMessage';
import { mentorService } from '../../services/mentor';
import { assignmentService } from '../../services/assignment';

/**
 * Modal form for a mentor to reject a pending assignment with remarks and suggested mentor
 */
export default function RejectAssignmentModal({ isOpen, onClose, assignment, onSuccess }) {
  const [loadingMentors, setLoadingMentors] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [mentors, setMentors] = useState([]);
  const [rejectionRemarks, setRejectionRemarks] = useState('');
  const [suggestedMentorId, setSuggestedMentorId] = useState('');

  useEffect(() => {
    async function loadMentors() {
      if (!isOpen || !assignment) return;

      setLoadingMentors(true);
      setErrorMsg('');
      setRejectionRemarks('');
      setSuggestedMentorId('');
      setMentors([]);

      try {
        const response = await mentorService.getMentors(1, 100);
        const mentorList = response.data || [];
        
        // Filter active mentors, and exclude the current mentor rejecting the assignment
        const activeOtherMentors = mentorList.filter(
          (m) => m.isActive && String(m.id) !== String(assignment.mentorId)
        );
        setMentors(activeOtherMentors);
      } catch (err) {
        console.error('Failed to load active mentors list:', err);
      } finally {
        setLoadingMentors(false);
      }
    }

    loadMentors();
  }, [isOpen, assignment]);

  if (!assignment) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedRemarks = rejectionRemarks.trim();
    if (!trimmedRemarks) {
      setErrorMsg('Rejection remarks are required.');
      return;
    }

    setErrorMsg('');
    setSubmitting(true);

    const payload = {
      rejectionRemarks: trimmedRemarks,
    };

    if (suggestedMentorId) {
      payload.suggestedMentorId = suggestedMentorId;
    }

    try {
      const response = await assignmentService.rejectAssignment(assignment.id, payload);

      if (response && response.success !== false) {
        await onSuccess();
        onClose();
      } else {
        throw new Error(response.error || 'Failed to reject assignment');
      }
    } catch (err) {
      console.error('Rejection submission failed:', err);
      setErrorMsg(err.response?.data?.error || 'Failed to process rejection. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const mentorOptions = [
    { value: '', label: 'Select a suggested mentor (Optional)...' },
    ...mentors.map((m) => ({
      value: m.id,
      label: `${m.fullName} (${m.email})`,
    })),
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Reject Task Assignment"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
        {errorMsg && (
          <ErrorMessage
            title="Rejection failed"
            message={errorMsg}
          />
        )}

        <p className="text-sm text-gray-600">
          You are rejecting the task assignment for{' '}
          <strong className="text-gray-900">{assignment.intern?.fullName || 'the intern'}</strong>. Please specify
          your reasons.
        </p>

        <Textarea
          id="rejectionRemarks"
          label="Rejection Remarks / Reason"
          placeholder="Please explain why you are rejecting this placement..."
          value={rejectionRemarks}
          onChange={(e) => setRejectionRemarks(e.target.value)}
          disabled={submitting}
          required
        />

        {loadingMentors ? (
          <div className="py-2 flex items-center justify-center">
            <Spinner size="xs" label="Loading alternate mentors..." />
          </div>
        ) : (
          mentors.length > 0 && (
            <Select
              id="suggestedMentor"
              label="Suggest Alternative Mentor (Optional)"
              options={mentorOptions}
              value={suggestedMentorId}
              onChange={(e) => setSuggestedMentorId(e.target.value)}
              disabled={submitting}
            />
          )
        )}

        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 text-red-800 dark:text-red-400 p-3 rounded-lg text-xs leading-relaxed mt-2">
          <strong>Impact:</strong> The intern will transition back to the <strong>Rejected by Mentor</strong> status,
          making them visible to the HR Admin for reassignment.
        </div>

        <div className="flex justify-end gap-3 mt-4 border-t border-gray-100 dark:border-slate-800 pt-4">
          <Button
            variant="secondary"
            disabled={submitting}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="danger"
            loading={submitting}
          >
            Confirm Rejection
          </Button>
        </div>
      </form>
    </Modal>
  );
}
