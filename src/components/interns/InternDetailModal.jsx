import React, { useState, useEffect } from 'react';
import { User, Calendar, BookOpen, Briefcase, FileText } from 'lucide-react';
import Modal from '../common/Modal';
import Spinner from '../common/Spinner';
import ErrorMessage from '../common/ErrorMessage';
import Badge from '../common/Badge';
import { getInternStatusLabel, getInternStatusVariant } from '../../utils/status';
import { formatDate } from '../../utils/dashboard';
import { internService } from '../../services/intern';

/**
 * Detailed profile modal view for a single intern
 */
export default function InternDetailModal({ isOpen, onClose, internId }) {
  const [intern, setIntern] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    async function fetchDetails() {
      if (!isOpen || !internId) return;

      setLoading(true);
      setErrorMsg('');
      setImageError(false);
      setIntern(null);

      try {
        const response = await internService.getInternById(internId);
        setIntern(response);
      } catch (err) {
        console.error('Failed to load intern details:', err);
        setErrorMsg(err.response?.data?.error || 'Failed to load intern profile details.');
      } finally {
        setLoading(false);
      }
    }

    fetchDetails();
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
      title="Intern Profile Details"
      maxWidthClass="max-w-3xl"
    >
      {loading && (
        <div className="py-12 flex items-center justify-center">
          <Spinner size="md" label="Loading profile..." />
        </div>
      )}

      {errorMsg && (
        <div className="py-6">
          <ErrorMessage
            title="Unable to load details"
            message={errorMsg}
            onRetry={() => {
              setErrorMsg('');
              setLoading(true);
              internService
                .getInternById(internId)
                .then((data) => {
                  setIntern(data);
                  setLoading(false);
                })
                .catch((err) => {
                  setErrorMsg(err.response?.data?.error || 'Failed to load intern details.');
                  setLoading(false);
                });
            }}
          />
        </div>
      )}

      {!loading && !errorMsg && intern && (
        <div className="flex flex-col gap-6 text-left">
          {/* Top Summary Banner */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50 border border-gray-150 p-4 rounded-xl">
            <div className="flex items-center gap-3">
              {intern.photoUrl && !imageError ? (
                <img
                  src={intern.photoUrl}
                  alt="Intern"
                  onError={() => setImageError(true)}
                  className="h-12 w-12 rounded-lg object-cover border border-gray-200 shrink-0"
                />
              ) : (
                <div className="h-12 w-12 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                  <User className="h-6 w-6" />
                </div>
              )}
              <div>
                <h4 className="text-sm font-bold text-gray-900 leading-tight">
                  {intern.fullName}
                </h4>
                <p className="text-xs text-gray-500 font-mono mt-0.5">
                  {intern.internId}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                Status:
              </span>
              <Badge variant={getInternStatusVariant(intern.status)} dot>
                {getInternStatusLabel(intern.status)}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Section 1: Personal Details */}
            <div className="space-y-4">
              <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-100 pb-1.5">
                <User className="h-3.5 w-3.5" /> Personal Details
              </h5>
              
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex flex-col">
                  <span className="text-gray-500">Date of Birth</span>
                  {renderValue(formatDate(intern.dateOfBirth))}
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-500">Aadhaar (Masked)</span>
                  {intern.aadhaarNumber ? (
                    <span className="text-gray-900 font-semibold font-mono" title="Aadhaar number is masked for privacy">
                      {intern.aadhaarNumber} <span className="text-[10px] text-gray-400 font-sans font-normal">(Masked)</span>
                    </span>
                  ) : (
                    renderValue(null)
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-500">Mobile Number</span>
                  {renderValue(intern.mobileNumber)}
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-500">Email Address</span>
                  {renderValue(intern.email)}
                </div>
                <div className="flex flex-col col-span-2">
                  <span className="text-gray-500">Present Address</span>
                  {renderValue(intern.presentAddress)}
                </div>
                <div className="flex flex-col col-span-2">
                  <span className="text-gray-500">Permanent Address</span>
                  {renderValue(intern.permanentAddress)}
                </div>
              </div>
            </div>

            {/* Section 2: Training Placement Details */}
            <div className="space-y-4">
              <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-100 pb-1.5">
                <Calendar className="h-3.5 w-3.5" /> Training Placement
              </h5>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex flex-col">
                  <span className="text-gray-500">Training Type</span>
                  {renderValue(intern.trainingType)}
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-500">Assigned Division</span>
                  {renderValue(intern.division)}
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-500">Start Date</span>
                  {renderValue(formatDate(intern.startDate))}
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-500">End Date</span>
                  {renderValue(formatDate(intern.endDate))}
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-500">Pass Number</span>
                  {renderValue(intern.passNumber)}
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-500">Identification Mark</span>
                  {renderValue(intern.identificationMark)}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Section 3: Academic Details */}
            <div className="space-y-4">
              <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-100 pb-1.5">
                <BookOpen className="h-3.5 w-3.5" /> Academic Information
              </h5>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex flex-col col-span-2">
                  <span className="text-gray-500">Institute Name</span>
                  {renderValue(intern.instituteName)}
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-500">Branch/Discipline</span>
                  {renderValue(intern.branch)}
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-500">Semester Marks/CGPA</span>
                  {renderValue(intern.semesterMarks)}
                </div>
                <div className="flex flex-col col-span-2">
                  <span className="text-gray-500">Educational Qualification</span>
                  {renderValue(intern.educationalQualification)}
                </div>
              </div>
            </div>

            {/* Section 4: Background Disclosures */}
            <div className="space-y-4">
              <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-100 pb-1.5">
                <Briefcase className="h-3.5 w-3.5" /> Experience & Disclosures
              </h5>

              <div className="grid grid-cols-1 gap-3 text-xs">
                <div className="flex flex-col">
                  <span className="text-gray-500">Family Members in Foreign Organizations</span>
                  {renderValue(intern.familyMembersInForeignOrganizations)}
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-500">Previous Organization Experience</span>
                  {renderValue(intern.previousOrganizationExperience)}
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-500">Previous DRDO Experience</span>
                  {renderValue(intern.previousDRDOExperience)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
