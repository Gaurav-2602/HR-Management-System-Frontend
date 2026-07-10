import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import ErrorMessage from '../common/ErrorMessage';
import { mentorService } from '../../services/mentor';

/**
 * Modal form for creating and editing mentor accounts
 */
export default function MentorFormModal({ isOpen, onClose, mentor = null, onSuccess }) {
  const isEditMode = !!mentor;

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Clear or load form state on open/reset
  useEffect(() => {
    if (isOpen) {
      setErrorMsg('');
      setShowPassword(false);
      if (isEditMode) {
        setFullName(mentor.fullName || '');
        setEmail(mentor.email || '');
        setPassword('');
      } else {
        setFullName('');
        setEmail('');
        setPassword('');
      }
    }
  }, [isOpen, mentor, isEditMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || !trimmedEmail) {
      setErrorMsg('Full name and email are required');
      return;
    }

    if (!isEditMode && !password) {
      setErrorMsg('Password is required');
      return;
    }

    if (!isEditMode && password.length < 8) {
      setErrorMsg('Password must be at least 8 characters');
      return;
    }

    setSubmitting(true);

    try {
      if (isEditMode) {
        await mentorService.updateMentor(mentor.id, {
          fullName: trimmedName,
          email: trimmedEmail,
        });
      } else {
        await mentorService.createMentor({
          fullName: trimmedName,
          email: trimmedEmail,
          password, // Sent exactly as entered (do not trim)
        });
      }
      
      // Notify parent page and close modal on success
      await onSuccess();
      onClose();
    } catch (err) {
      console.error('Mentor operation failed:', err);
      // Support backend error response shape
      const backendMessage = err.response?.data?.message;
      if (backendMessage) {
        setErrorMsg(backendMessage);
      } else {
        setErrorMsg('Failed to process request. Please check your network and try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const passwordToggleBtn = (
    <button
      type="button"
      onClick={() => setShowPassword((prev) => !prev)}
      disabled={submitting}
      className="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-indigo-600 focus:ring-1 focus:ring-indigo-500 rounded p-1"
      aria-label={showPassword ? 'Hide password' : 'Show password'}
    >
      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
    </button>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? 'Edit Mentor Details' : 'Add New Mentor'}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {errorMsg && (
          <ErrorMessage
            title={isEditMode ? 'Failed to update details' : 'Failed to create mentor'}
            message={errorMsg}
          />
        )}

        <Input
          id="fullName"
          type="text"
          label="Full Name"
          placeholder="e.g. John Doe"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          disabled={submitting}
          required
        />

        <Input
          id="email"
          type="email"
          label="Email Address"
          placeholder="name@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={submitting}
          required
        />

        {!isEditMode && (
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            label="Password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={submitting}
            required
            rightElement={passwordToggleBtn}
          />
        )}

        <div className="flex justify-end gap-3 mt-4 border-t border-gray-100 pt-4">
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
          >
            {isEditMode ? 'Save Changes' : 'Create Account'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
