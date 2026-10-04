/**
 * PRMS — Centralized Dynamic Date Utility
 * Generates actual dynamic dates and timestamps in real-time
 */

export const getNow = (): Date => new Date();

export const getCurrentFormattedDate = (): string => {
  const d = getNow();
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }); // e.g. "04 Oct 2026"
};

export const getCurrentFormattedDateTime = (): string => {
  const d = getNow();
  const dateStr = d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
  const timeStr = d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
  return `${dateStr}, ${timeStr}`; // e.g. "04 Oct 2026, 05:57 AM"
};

export const getPastFormattedDate = (daysAgo: number): string => {
  const d = getNow();
  d.setDate(d.getDate() - daysAgo);
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

export const getPastFormattedDateTime = (daysAgo: number, hoursAgo: number = 0): string => {
  const d = getNow();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(d.getHours() - hoursAgo);
  const dateStr = d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
  const timeStr = d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
  return `${dateStr}, ${timeStr}`;
};

export const getCurrentMonthDueDate = (): string => {
  const d = getNow();
  const monthName = d.toLocaleDateString('en-GB', { month: 'long' });
  const year = d.getFullYear();
  return `05 ${monthName} ${year}`; // e.g. "05 October 2026"
};

export const getNextMonthDueDate = (): string => {
  const d = getNow();
  d.setMonth(d.getMonth() + 1);
  const monthName = d.toLocaleDateString('en-GB', { month: 'long' });
  const year = d.getFullYear();
  return `05 ${monthName} ${year}`;
};

export const getCurrentYearLeaseDates = () => {
  const d = getNow();
  const year = d.getFullYear();
  return {
    start: `${year}-01-01`,
    end: `${year}-12-31`
  };
};
