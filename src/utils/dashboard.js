/**
 * Helper to construct chronological list of the last 12 calendar months.
 * Merges backend registrations, filling in missing months with 0 counts.
 * Uses current calendar month as final month, handling year boundaries correctly.
 * @param {Array<{year: number, month: number, count: number}>} backendData 
 * @returns {Array<{year: number, month: number, count: number, label: string, yearLabel: string}>}
 */
export function fillMonthlyRegistrations(backendData = []) {
  const result = [];
  const currentDate = new Date();
  
  // Go back 11 months to span a total of 12 calendar months
  for (let i = 11; i >= 0; i--) {
    const d = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    const year = d.getFullYear();
    const month = d.getMonth() + 1; // 1-indexed to match backend
    
    // Find matching month from API response
    const match = Array.isArray(backendData)
      ? backendData.find((item) => item && item.year === year && item.month === month)
      : null;
      
    result.push({
      year,
      month,
      count: match ? match.count : 0,
      label: d.toLocaleString('default', { month: 'short' }),
      yearLabel: year.toString().slice(-2),
    });
  }
  
  return result;
}

/**
 * Safely format ISO date strings for user tables
 * @param {string} dateString 
 * @returns {string}
 */
export function formatDate(dateString) {
  if (!dateString) return '—';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch (error) {
    return '—';
  }
}
