/**
 * Central utility for mapping backend status enums to user-friendly labels and styles.
 * Keeps actual backend enum values unchanged internally.
 */

export const INTERN_STATUS = {
  NEW: 'NEW',
  ASSIGNED: 'ASSIGNED',
  REJECTED_BY_MENTOR: 'REJECTED_BY_MENTOR',
  ONGOING: 'ONGOING',
  COMPLETED: 'COMPLETED',
  ISSUED: 'ISSUED',
};

export const ASSIGNMENT_STATUS = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
};

const INTERN_STATUS_METADATA = {
  [INTERN_STATUS.NEW]: {
    label: 'New',
    badgeVariant: 'neutral',
  },
  [INTERN_STATUS.ASSIGNED]: {
    label: 'Assigned',
    badgeVariant: 'info',
  },
  [INTERN_STATUS.REJECTED_BY_MENTOR]: {
    label: 'Rejected by Mentor',
    badgeVariant: 'danger',
  },
  [INTERN_STATUS.ONGOING]: {
    label: 'Ongoing',
    badgeVariant: 'warning',
  },
  [INTERN_STATUS.COMPLETED]: {
    label: 'Completed',
    badgeVariant: 'success',
  },
  [INTERN_STATUS.ISSUED]: {
    label: 'Issued',
    badgeVariant: 'success',
  },
};

const ASSIGNMENT_STATUS_METADATA = {
  [ASSIGNMENT_STATUS.PENDING]: {
    label: 'Pending',
    badgeVariant: 'warning',
  },
  [ASSIGNMENT_STATUS.ACCEPTED]: {
    label: 'Accepted',
    badgeVariant: 'success',
  },
  [ASSIGNMENT_STATUS.REJECTED]: {
    label: 'Rejected',
    badgeVariant: 'danger',
  },
};

/**
 * Get user-friendly label for intern status
 * @param {string} status 
 * @returns {string}
 */
export function getInternStatusLabel(status) {
  return INTERN_STATUS_METADATA[status]?.label || status || '';
}

/**
 * Get badge variant (e.g. success, danger, warning) for intern status
 * @param {string} status 
 * @returns {string}
 */
export function getInternStatusVariant(status) {
  return INTERN_STATUS_METADATA[status]?.badgeVariant || 'default';
}

/**
 * Get user-friendly label for assignment status
 * @param {string} status 
 * @returns {string}
 */
export function getAssignmentStatusLabel(status) {
  return ASSIGNMENT_STATUS_METADATA[status]?.label || status || '';
}

/**
 * Get badge variant (e.g. success, danger, warning) for assignment status
 * @param {string} status 
 * @returns {string}
 */
export function getAssignmentStatusVariant(status) {
  return ASSIGNMENT_STATUS_METADATA[status]?.badgeVariant || 'default';
}
