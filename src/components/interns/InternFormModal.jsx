import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Textarea from '../common/Textarea';
import Select from '../common/Select';
import Button from '../common/Button';
import Spinner from '../common/Spinner';
import ErrorMessage from '../common/ErrorMessage';
import { internService } from '../../services/intern';

function dateToInputString(dateVal) {
  if (!dateVal) return '';
  try {
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return '';
    return d.toISOString().split('T')[0];
  } catch (e) {
    return '';
  }
}

/**
 * Tabbed multi-step modal form for creating and editing interns
 */
export default function InternFormModal({ isOpen, onClose, internId = null, onSuccess }) {
  const isEditMode = !!internId;

  // Tabs state: 'personal', 'academic', 'training'
  const [activeTab, setActiveTab] = useState('personal');

  // Form Loading & Error States
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Intern static info (for edit context display)
  const [internIdLabel, setInternIdLabel] = useState('');
  const [currentStatusLabel, setCurrentStatusLabel] = useState('');
  const [currentAadhaarMasked, setCurrentAadhaarMasked] = useState('');

  // TAB 1 States
  const [fullName, setFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [aadhaarNumber, setAadhaarNumber] = useState(''); // CREATE mode
  const [newAadhaarNumber, setNewAadhaarNumber] = useState(''); // EDIT mode
  const [presentAddress, setPresentAddress] = useState('');
  const [permanentAddress, setPermanentAddress] = useState('');

  // TAB 2 States
  const [educationalQualification, setEducationalQualification] = useState('');
  const [instituteName, setInstituteName] = useState('');
  const [branch, setBranch] = useState('');
  const [semesterMarks, setSemesterMarks] = useState('');
  const [familyMembersInForeignOrganizations, setFamilyMembersInForeignOrganizations] = useState('');
  const [previousOrganizationExperience, setPreviousOrganizationExperience] = useState('');
  const [previousDRDOExperience, setPreviousDRDOExperience] = useState('');

  // TAB 3 States
  const [trainingType, setTrainingType] = useState('TRAINING');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [division, setDivision] = useState('');
  const [passNumber, setPassNumber] = useState('');
  const [identificationMark, setIdentificationMark] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');

  // Reset form values or fetch details on open
  useEffect(() => {
    async function loadDetails() {
      if (!isOpen) return;

      setErrorMsg('');
      setActiveTab('personal');
      setSubmitting(false);

      if (isEditMode) {
        setLoadingDetails(true);
        try {
          const res = await internService.getInternById(internId);
          if (res) {
            setInternIdLabel(res.internId || '');
            setCurrentStatusLabel(res.status || 'NEW');
            setCurrentAadhaarMasked(res.aadhaarNumber || '');

            setFullName(res.fullName || '');
            setDateOfBirth(dateToInputString(res.dateOfBirth));
            setEmail(res.email || '');
            setMobileNumber(res.mobileNumber || '');
            setAadhaarNumber('');
            setNewAadhaarNumber('');
            setPresentAddress(res.presentAddress || '');
            setPermanentAddress(res.permanentAddress || '');

            setEducationalQualification(res.educationalQualification || '');
            setInstituteName(res.instituteName || '');
            setBranch(res.branch || '');
            setSemesterMarks(res.semesterMarks || '');
            setFamilyMembersInForeignOrganizations(res.familyMembersInForeignOrganizations || '');
            setPreviousOrganizationExperience(res.previousOrganizationExperience || '');
            setPreviousDRDOExperience(res.previousDRDOExperience || '');

            setTrainingType(res.trainingType || 'TRAINING');
            setStartDate(dateToInputString(res.startDate));
            setEndDate(dateToInputString(res.endDate));
            setDivision(res.division || '');
            setPassNumber(res.passNumber || '');
            setIdentificationMark(res.identificationMark || '');
            setPhotoUrl(res.photoUrl || '');
          }
        } catch (err) {
          console.error('Failed to load intern details for edit:', err);
          setErrorMsg(err.response?.data?.error || 'Failed to load intern profile details.');
        } finally {
          setLoadingDetails(false);
        }
      } else {
        // Reset to empty values for creation
        setInternIdLabel('');
        setCurrentStatusLabel('');
        setCurrentAadhaarMasked('');

        setFullName('');
        setDateOfBirth('');
        setEmail('');
        setMobileNumber('');
        setAadhaarNumber('');
        setNewAadhaarNumber('');
        setPresentAddress('');
        setPermanentAddress('');

        setEducationalQualification('');
        setInstituteName('');
        setBranch('');
        setSemesterMarks('');
        setFamilyMembersInForeignOrganizations('');
        setPreviousOrganizationExperience('');
        setPreviousDRDOExperience('');

        setTrainingType('TRAINING');
        setStartDate('');
        setEndDate('');
        setDivision('');
        setPassNumber('');
        setIdentificationMark('');
        setPhotoUrl('');
      }
    }

    loadDetails();
  }, [isOpen, internId, isEditMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // 1. Client-side field validations mapping to tabs
    if (!fullName.trim() || !dateOfBirth || !email.trim() || !mobileNumber.trim() || !presentAddress.trim()) {
      setActiveTab('personal');
      setErrorMsg('Please complete all required fields in the Personal & Contact section.');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setActiveTab('personal');
      setErrorMsg('Invalid email address format.');
      return;
    }

    // Aadhaar validations
    if (!isEditMode && aadhaarNumber && !/^\d{12}$/.test(aadhaarNumber)) {
      setActiveTab('personal');
      setErrorMsg('Aadhaar number must be exactly 12 numeric digits.');
      return;
    }

    if (isEditMode && newAadhaarNumber && !/^\d{12}$/.test(newAadhaarNumber)) {
      setActiveTab('personal');
      setErrorMsg('New Aadhaar number must be exactly 12 numeric digits.');
      return;
    }

    if (!educationalQualification.trim() || !instituteName.trim() || !branch.trim()) {
      setActiveTab('academic');
      setErrorMsg('Please complete all required fields in the Academic & Experience section.');
      return;
    }

    if (!trainingType || !startDate || !endDate) {
      setActiveTab('training');
      setErrorMsg('Please complete all required fields in the Training & Placement section.');
      return;
    }

    if (startDate >= endDate) {
      setActiveTab('training');
      setErrorMsg('Placement Start Date must be chronologically before the End Date.');
      return;
    }

    setSubmitting(true);

    // 2. Build sanitized payload
    const payload = {
      fullName: fullName.trim(),
      dateOfBirth,
      presentAddress: presentAddress.trim(),
      permanentAddress: permanentAddress.trim(),
      mobileNumber: mobileNumber.trim(),
      email: email.trim(),
      photoUrl: photoUrl.trim(),
      educationalQualification: educationalQualification.trim(),
      instituteName: instituteName.trim(),
      branch: branch.trim(),
      semesterMarks: semesterMarks.trim(),
      familyMembersInForeignOrganizations: familyMembersInForeignOrganizations.trim(),
      previousOrganizationExperience: previousOrganizationExperience.trim(),
      previousDRDOExperience: previousDRDOExperience.trim(),
      trainingType,
      startDate,
      endDate,
      division: division.trim(),
      identificationMark: identificationMark.trim(),
      passNumber: passNumber.trim(),
    };

    // Aadhaar payload mapping
    if (isEditMode) {
      // Blank means unchanged, so omit completely. Only submit if provided and valid.
      if (newAadhaarNumber.trim()) {
        payload.aadhaarNumber = newAadhaarNumber.trim();
      }
    } else {
      if (aadhaarNumber.trim()) {
        payload.aadhaarNumber = aadhaarNumber.trim();
      }
    }

    try {
      if (isEditMode) {
        await internService.updateIntern(internId, payload);
      } else {
        await internService.createIntern(payload);
      }

      await onSuccess();
      onClose();
    } catch (err) {
      console.error('Intern form submission failed:', err);
      setErrorMsg(err.response?.data?.error || 'A backend validation check failed. Please verify all inputs.');
    } finally {
      setSubmitting(false);
    }
  };

  const tabs = [
    { id: 'personal', label: '1. Personal & Contact' },
    { id: 'academic', label: '2. Academic & Background' },
    { id: 'training', label: '3. Placement & Training' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? 'Modify Intern Profile' : 'Register New Intern'}
      maxWidthClass="max-w-2xl"
    >
      {loadingDetails ? (
        <div className="py-12 flex items-center justify-center">
          <Spinner size="md" label="Loading intern profile..." />
        </div>
      ) : (
        <div className="flex flex-col gap-5 text-left">
          {errorMsg && <ErrorMessage title="Validation Warning" message={errorMsg} />}

          {/* Edit mode context info banner */}
          {isEditMode && (
            <div className="flex items-center justify-between text-xs bg-slate-50 border border-gray-150 p-3 rounded-lg">
              <div>
                <span className="text-gray-500 font-medium">Intern ID:</span>{' '}
                <strong className="text-gray-900 font-mono">{internIdLabel}</strong>
              </div>
              <div>
                <span className="text-gray-500 font-medium">Current Status:</span>{' '}
                <strong className="text-gray-900">{currentStatusLabel}</strong>
              </div>
            </div>
          )}

          {/* Tabs Navigation */}
          <div className="border-b border-gray-200 flex gap-2 overflow-x-auto select-none pb-0.5">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                disabled={submitting}
                className={`py-2 px-3 text-xs font-semibold border-b-2 whitespace-nowrap outline-none focus:ring-2 focus:ring-indigo-500/20 rounded-t
                  ${
                    activeTab === tab.id
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-900'
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* TAB 1: Personal & Contact */}
            {activeTab === 'personal' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  id="dateOfBirth"
                  type="date"
                  label="Date of Birth"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  disabled={submitting}
                  required
                />

                <Input
                  id="email"
                  type="email"
                  label="Email Address"
                  placeholder="name@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={submitting}
                  required
                />

                <Input
                  id="mobileNumber"
                  type="text"
                  label="Mobile Number"
                  placeholder="e.g. +91 9988776655"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  disabled={submitting}
                  required
                />

                {/* Aadhaar Conditional Fields */}
                {!isEditMode ? (
                  <Input
                    id="aadhaarNumber"
                    type="text"
                    label="Aadhaar Number (Optional)"
                    placeholder="12-digit number"
                    maxLength={12}
                    inputMode="numeric"
                    value={aadhaarNumber}
                    onChange={(e) => setAadhaarNumber(e.target.value.replace(/\D/g, ''))}
                    disabled={submitting}
                  />
                ) : (
                  <div className="flex flex-col gap-3 col-span-1 md:col-span-2 border border-gray-100 p-3 rounded-lg bg-slate-50/50">
                    <div className="text-xs">
                      <span className="text-gray-500 font-medium">Current Aadhaar Number:</span>{' '}
                      {currentAadhaarMasked ? (
                        <strong className="text-gray-900 font-mono">{currentAadhaarMasked}</strong>
                      ) : (
                        <span className="text-gray-400">Not Provided</span>
                      )}
                    </div>
                    <Input
                      id="newAadhaarNumber"
                      type="text"
                      label="New Aadhaar Number (Optional - Leave blank to keep current)"
                      placeholder="12-digit number"
                      maxLength={12}
                      inputMode="numeric"
                      value={newAadhaarNumber}
                      onChange={(e) => setNewAadhaarNumber(e.target.value.replace(/\D/g, ''))}
                      disabled={submitting}
                    />
                  </div>
                )}

                <Textarea
                  id="presentAddress"
                  label="Present Address"
                  placeholder="Current residing address"
                  value={presentAddress}
                  onChange={(e) => setPresentAddress(e.target.value)}
                  disabled={submitting}
                  required
                  className="col-span-1 md:col-span-2"
                />

                <Textarea
                  id="permanentAddress"
                  label="Permanent Address (Optional)"
                  placeholder="Leave blank if same as present address"
                  value={permanentAddress}
                  onChange={(e) => setPermanentAddress(e.target.value)}
                  disabled={submitting}
                  className="col-span-1 md:col-span-2"
                />
              </div>
            )}

            {/* TAB 2: Academic & Experience */}
            {activeTab === 'academic' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  id="instituteName"
                  type="text"
                  label="Institute Name"
                  placeholder="e.g. IIT Delhi"
                  value={instituteName}
                  onChange={(e) => setInstituteName(e.target.value)}
                  disabled={submitting}
                  required
                  className="col-span-1 md:col-span-2"
                />

                <Input
                  id="branch"
                  type="text"
                  label="Branch / Discipline"
                  placeholder="e.g. Computer Science"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  disabled={submitting}
                  required
                />

                <Input
                  id="educationalQualification"
                  type="text"
                  label="Educational Qualification"
                  placeholder="e.g. B.Tech (Final Year)"
                  value={educationalQualification}
                  onChange={(e) => setEducationalQualification(e.target.value)}
                  disabled={submitting}
                  required
                />

                <Input
                  id="semesterMarks"
                  type="text"
                  label="Semester Marks / CGPA (Optional)"
                  placeholder="e.g. 8.5 CGPA"
                  value={semesterMarks}
                  onChange={(e) => setSemesterMarks(e.target.value)}
                  disabled={submitting}
                />

                <Textarea
                  id="familyMembersInForeignOrganizations"
                  label="Family Members in Foreign Organizations (Optional)"
                  placeholder="Specify details if any family member works in a foreign agency"
                  value={familyMembersInForeignOrganizations}
                  onChange={(e) => setFamilyMembersInForeignOrganizations(e.target.value)}
                  disabled={submitting}
                  className="col-span-1 md:col-span-2"
                />

                <Textarea
                  id="previousOrganizationExperience"
                  label="Previous Organization Experience (Optional)"
                  placeholder="Details of previous internships or placements"
                  value={previousOrganizationExperience}
                  onChange={(e) => setPreviousOrganizationExperience(e.target.value)}
                  disabled={submitting}
                  className="col-span-1 md:col-span-2"
                />

                <Textarea
                  id="previousDRDOExperience"
                  label="Previous DRDO Experience (Optional)"
                  placeholder="Specify laboratory name and period if worked in DRDO previously"
                  value={previousDRDOExperience}
                  onChange={(e) => setPreviousDRDOExperience(e.target.value)}
                  disabled={submitting}
                  className="col-span-1 md:col-span-2"
                />
              </div>
            )}

            {/* TAB 3: Training & Placement */}
            {activeTab === 'training' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  id="trainingType"
                  label="Training Type"
                  options={[
                    { value: 'TRAINING', label: 'Training' },
                    { value: 'INTERNSHIP', label: 'Internship' },
                  ]}
                  value={trainingType}
                  onChange={(e) => setTrainingType(e.target.value)}
                  disabled={submitting}
                  required
                />

                <Input
                  id="division"
                  type="text"
                  label="Assigned Division (Optional)"
                  placeholder="e.g. IT Division"
                  value={division}
                  onChange={(e) => setDivision(e.target.value)}
                  disabled={submitting}
                />

                <Input
                  id="startDate"
                  type="date"
                  label="Start Date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  disabled={submitting}
                  required
                />

                <Input
                  id="endDate"
                  type="date"
                  label="End Date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  disabled={submitting}
                  required
                />

                <Input
                  id="passNumber"
                  type="text"
                  label="Pass Number (Optional)"
                  placeholder="Gate entry pass details"
                  value={passNumber}
                  onChange={(e) => setPassNumber(e.target.value)}
                  disabled={submitting}
                />

                <Input
                  id="identificationMark"
                  type="text"
                  label="Identification Mark (Optional)"
                  placeholder="Physical identification markers"
                  value={identificationMark}
                  onChange={(e) => setIdentificationMark(e.target.value)}
                  disabled={submitting}
                />

                <Input
                  id="photoUrl"
                  type="text"
                  label="Photo URL (Optional)"
                  placeholder="Link to profile photo"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  disabled={submitting}
                  className="col-span-1 md:col-span-2"
                />
              </div>
            )}

            {/* Footer Buttons with Tab Navigation Helpers */}
            <div className="flex items-center justify-between mt-6 border-t border-gray-150 pt-4 shrink-0 select-none">
              <div>
                {activeTab !== 'personal' && (
                  <Button
                    variant="secondary"
                    type="button"
                    disabled={submitting}
                    onClick={() => {
                      if (activeTab === 'training') setActiveTab('academic');
                      else if (activeTab === 'academic') setActiveTab('personal');
                    }}
                  >
                    Back
                  </Button>
                )}
              </div>
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  disabled={submitting}
                  onClick={onClose}
                  type="button"
                >
                  Cancel
                </Button>

                {activeTab !== 'training' ? (
                  <Button
                    variant="primary"
                    type="button"
                    disabled={submitting}
                    onClick={() => {
                      if (activeTab === 'personal') {
                        if (!fullName.trim() || !dateOfBirth || !email.trim() || !mobileNumber.trim() || !presentAddress.trim()) {
                          setErrorMsg('Please complete all required fields.');
                          return;
                        }
                        setErrorMsg('');
                        setActiveTab('academic');
                      } else if (activeTab === 'academic') {
                        if (!educationalQualification.trim() || !instituteName.trim() || !branch.trim()) {
                          setErrorMsg('Please complete all required fields.');
                          return;
                        }
                        setErrorMsg('');
                        setActiveTab('training');
                      }
                    }}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="primary"
                    loading={submitting}
                  >
                    {isEditMode ? 'Save Profile' : 'Register Intern'}
                  </Button>
                )}
              </div>
            </div>
          </form>
        </div>
      )}
    </Modal>
  );
}
