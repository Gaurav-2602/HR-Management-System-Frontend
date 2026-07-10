import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Select from '../common/Select';
import Button from '../common/Button';
import Spinner from '../common/Spinner';
import ErrorMessage from '../common/ErrorMessage';
import { internService } from '../../services/intern';
import { mentorService } from '../../services/mentor';
import { assignmentService } from '../../services/assignment';
import { getInternStatusLabel } from '../../utils/status';

/**
 * Modal form for HR Admin to match an eligible intern with an active mentor
 */
export default function CreateAssignmentModal({ isOpen, onClose, onSuccess }) {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [eligibleInterns, setEligibleInterns] = useState([]);
  const [mentors, setMentors] = useState([]);

  const [selectedIntern, setSelectedIntern] = useState('');
  const [selectedMentor, setSelectedMentor] = useState('');

  useEffect(() => {
    async function loadData() {
      if (!isOpen) return;

      setLoading(true);
      setErrorMsg('');
      setEligibleInterns([]);
      setMentors([]);
      setSelectedIntern('');
      setSelectedMentor('');

      try {
        // Fetch NEW and REJECTED_BY_MENTOR interns in parallel
        const [resNew, resRejected, resMentors] = await Promise.all([
          internService.getInterns({ page: 1, limit: 100, status: 'NEW' }),
          internService.getInterns({ page: 1, limit: 100, status: 'REJECTED_BY_MENTOR' }),
          mentorService.getMentors(1, 100),
        ]);

        const mergedInterns = [
          ...(resNew.data || []),
          ...(resRejected.data || []),
        ];
        setEligibleInterns(mergedInterns);

        // Filter active mentors client side (backend response array is under the 'data' key)
        const mentorList = resMentors.data || [];
        const activeMentors = mentorList.filter((m) => m.isActive);
        setMentors(activeMentors);
      } catch (err) {
        console.error('Failed to load matching candidates:', err);
        setErrorMsg('Failed to retrieve candidates. Please check your connection.');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedIntern || !selectedMentor) {
      setErrorMsg('Please select both an intern and a mentor.');
      return;
    }

    setErrorMsg('');
    setSubmitting(true);

    try {
      const response = await assignmentService.createAssignment({
        internId: selectedIntern,
        mentorId: selectedMentor,
      });

      // Call success hook with completed assignment details
      if (response && response.success !== false) {
        await onSuccess(response.assignment);
        onClose();
      } else {
        throw new Error(response.error || 'Failed to match intern');
      }
    } catch (err) {
      console.error('Failed to assign intern:', err);
      setErrorMsg(err.response?.data?.error || 'Failed to complete assignment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const internOptions = [
    { value: '', label: 'Choose an eligible intern...' },
    ...eligibleInterns.map((intern) => ({
      value: intern.id,
      label: `${intern.fullName} (${intern.internId}) — [${getInternStatusLabel(intern.status)}]`,
    })),
  ];

  const mentorOptions = [
    { value: '', label: 'Choose an active mentor...' },
    ...mentors.map((mentor) => ({
      value: mentor.id,
      label: `${mentor.fullName} (${mentor.email})`,
    })),
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Assign Intern to Mentor"
    >
      {loading ? (
        <div className="py-10 flex items-center justify-center">
          <Spinner size="md" label="Retrieving placement lists..." />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
          {errorMsg && (
            <ErrorMessage
              title="Assignment failed"
              message={errorMsg}
            />
          )}

          {eligibleInterns.length === 0 ? (
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 text-amber-800 dark:text-amber-400 p-4 rounded-lg text-xs leading-relaxed">
              <strong>No eligible interns found.</strong> Interns must have status <strong>New</strong> or{' '}
              <strong>Rejected by Mentor</strong> to be matched with a mentor. Please register or update intern
              status first.
            </div>
          ) : mentors.length === 0 ? (
            <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 text-rose-800 dark:text-rose-450 p-4 rounded-lg text-xs leading-relaxed">
              <strong>No active mentors found.</strong> Please register or activate a mentor account to initiate
              matching.
            </div>
          ) : (
            <>
              <Select
                id="internSelect"
                label="Select Intern"
                options={internOptions}
                value={selectedIntern}
                onChange={(e) => setSelectedIntern(e.target.value)}
                disabled={submitting}
                required
              />

              <Select
                id="mentorSelect"
                label="Select Mentor"
                options={mentorOptions}
                value={selectedMentor}
                onChange={(e) => setSelectedMentor(e.target.value)}
                disabled={submitting}
                required
              />

              <div className="bg-slate-50 dark:bg-slate-800/40 border border-gray-150 dark:border-slate-800 p-3 rounded-lg text-xs text-gray-500 dark:text-gray-400 leading-relaxed mt-2">
                Once assigned, the intern status transitions to <strong>Assigned</strong>. The mentor will receive a
                pending task notification to accept or reject the assignment.
              </div>
            </>
          )}

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
              variant="primary"
              loading={submitting}
              disabled={eligibleInterns.length === 0 || mentors.length === 0 || submitting}
            >
              Confirm Assignment
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
