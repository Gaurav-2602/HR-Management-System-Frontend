import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Textarea from '../common/Textarea';
import Select from '../common/Select';
import Button from '../common/Button';
import Spinner from '../common/Spinner';
import ErrorMessage from '../common/ErrorMessage';
import { progressService } from '../../services/progress';

/**
 * Modal form for recording new progress updates for an ongoing intern
 */
export default function RecordProgressModal({ isOpen, onClose, intern, onSuccess }) {
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // History context variables
  const [highestPercentage, setHighestPercentage] = useState(-1);
  const [isCappedAt99, setIsCappedAt99] = useState(false);

  // Form Field States
  const [progressPercentage, setProgressPercentage] = useState('');
  const [remarks, setRemarks] = useState('');
  const [performanceRating, setPerformanceRating] = useState('');
  const [skillsInput, setSkillsInput] = useState('');
  const [nextGoals, setNextGoals] = useState('');

  useEffect(() => {
    async function loadHistory() {
      if (!isOpen || !intern) return;

      setLoadingHistory(true);
      setErrorMsg('');
      setHighestPercentage(-1);
      setIsCappedAt99(false);

      // Reset form fields
      setProgressPercentage('');
      setRemarks('');
      setPerformanceRating('');
      setSkillsInput('');
      setNextGoals('');

      try {
        const response = await progressService.getProgressHistory(intern.id);
        const historyList = response.data || [];
        
        // Calculate highest progress recorded (excluding final evaluations if any, though final blocks ongoing status)
        let maxVal = -1;
        for (const item of historyList) {
          if (item.progressPercentage > maxVal) {
            maxVal = item.progressPercentage;
          }
        }

        setHighestPercentage(maxVal);
        
        if (maxVal >= 99) {
          setIsCappedAt99(true);
        } else {
          // Pre-populate input with next logical percentage increment
          setProgressPercentage(String(maxVal + 1));
        }
      } catch (err) {
        console.error('Failed to retrieve progress history contexts:', err);
        setErrorMsg('Failed to check progress history. Please try again.');
      } finally {
        setLoadingHistory(false);
      }
    }

    loadHistory();
  }, [isOpen, intern]);

  if (!intern) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const targetPercent = parseInt(progressPercentage, 10);

    // 1. Client-side validations
    if (isNaN(targetPercent) || targetPercent < 0 || targetPercent > 99) {
      setErrorMsg('Progress percentage must be an integer between 0 and 99.');
      return;
    }

    if (targetPercent <= highestPercentage) {
      setErrorMsg(`Progress percentage must be strictly greater than the latest recorded value (${highestPercentage}%).`);
      return;
    }

    const trimmedRemarks = remarks.trim();
    if (!trimmedRemarks) {
      setErrorMsg('Remarks are required.');
      return;
    }

    setSubmitting(true);

    // 2. Format optional skills list
    let skillsArray;
    if (skillsInput.trim()) {
      skillsArray = skillsInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    }

    // 3. Assemble payload (send exactly required/optional fields, omit undefined values)
    const payload = {
      internId: intern.id, // Must use Intern MongoDB ObjectId
      progressPercentage: targetPercent,
      remarks: trimmedRemarks,
    };

    if (performanceRating) {
      payload.performanceRating = parseInt(performanceRating, 10);
    }
    if (skillsArray && skillsArray.length > 0) {
      payload.skillsCovered = skillsArray;
    }
    if (nextGoals.trim()) {
      payload.nextGoals = nextGoals.trim();
    }

    try {
      const response = await progressService.recordProgress(payload);
      if (response && response.success !== false) {
        await onSuccess();
        onClose();
      } else {
        throw new Error(response.error || 'Failed to record progress update.');
      }
    } catch (err) {
      console.error('Failed to submit progress update:', err);
      setErrorMsg(err.response?.data?.error || 'A conflict or validation error occurred. Please verify values.');
    } finally {
      setSubmitting(false);
    }
  };

  const currentProgressPercent = highestPercentage >= 0 ? highestPercentage : 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Record Intern Progress"
    >
      {loadingHistory ? (
        <div className="py-10 flex items-center justify-center">
          <Spinner size="md" label="Loading previous progress metrics..." />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
          {errorMsg && (
            <ErrorMessage
              title="Submission rejected"
              message={errorMsg}
            />
          )}

          {/* Current Progress Dashboard */}
          <div className="bg-slate-50 dark:bg-slate-800/40 border border-gray-150 dark:border-slate-800 p-4 rounded-xl flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <span>Supervised Trainee: {intern.fullName}</span>
              <span>
                {highestPercentage >= 0 ? `Latest: ${highestPercentage}%` : 'No progress recorded yet'}
              </span>
            </div>
            
            {/* CSS Progress Bar */}
            <div className="w-full bg-gray-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden mt-1 select-none">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${currentProgressPercent}%` }}
              />
            </div>
          </div>

          {isCappedAt99 ? (
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-250 dark:border-amber-900/50 text-amber-800 dark:text-amber-400 p-4 rounded-lg text-xs leading-relaxed mt-2">
              <strong>Progress limit reached:</strong> Trainee is currently logged at <strong>99%</strong> progress.
              Normal progress updates are capped at 99%. Please proceed to the <strong>Complete Training</strong>{' '}
              action to submit the final 100% evaluation.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  id="progressPercentage"
                  type="number"
                  label={`Progress Percentage (Min: ${highestPercentage + 1}, Max: 99)`}
                  min={highestPercentage + 1}
                  max={99}
                  required
                  value={progressPercentage}
                  onChange={(e) => setProgressPercentage(e.target.value)}
                  disabled={submitting}
                />

                <Select
                  id="performanceRating"
                  label="Performance Rating (Optional)"
                  options={[
                    { value: '', label: 'Select rating...' },
                    { value: '1', label: '1 - Unsatisfactory' },
                    { value: '2', label: '2 - Needs Improvement' },
                    { value: '3', label: '3 - Satisfactory' },
                    { value: '4', label: '4 - Very Good' },
                    { value: '5', label: '5 - Outstanding' },
                  ]}
                  value={performanceRating}
                  onChange={(e) => setPerformanceRating(e.target.value)}
                  disabled={submitting}
                />
              </div>

              <Textarea
                id="remarks"
                label="Progress Remarks / Comments"
                placeholder="Detail the trainee's weekly work, achievements, and performance..."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                disabled={submitting}
                required
              />

              <Input
                id="skillsCovered"
                type="text"
                label="Skills Covered (Optional - Comma separated list)"
                placeholder="e.g. React, JavaScript, Node.js"
                value={skillsInput}
                onChange={(e) => setSkillsInput(e.target.value)}
                disabled={submitting}
              />

              <Input
                id="nextGoals"
                type="text"
                label="Next Target Goals (Optional)"
                placeholder="Key goals for the upcoming week..."
                value={nextGoals}
                onChange={(e) => setNextGoals(e.target.value)}
                disabled={submitting}
              />
            </>
          )}

          <div className="flex justify-end gap-3 mt-4 border-t border-gray-100 dark:border-slate-800 pt-4">
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
              disabled={isCappedAt99 || submitting}
            >
              Record Update
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
