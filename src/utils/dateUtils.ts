export const formatDateString = (input: string): string => {
  // Remove any non-digit characters
  const digitsOnly = input.replace(/\D/g, '');
  
  // Ensure we have exactly 8 digits
  if (digitsOnly.length !== 8) {
    throw new Error('Invalid date format');
  }

  // Convert to DDMMYYYY format
  return digitsOnly;
};

export const isValidDate = (dateStr: string): boolean => {
  try {
    const formatted = formatDateString(dateStr);
    const day = parseInt(formatted.substring(0, 2));
    const month = parseInt(formatted.substring(2, 4));
    const year = parseInt(formatted.substring(4, 8));

    // Create Date object and check if it's valid
    const date = new Date(year, month - 1, day);
    return date.getDate() === day &&
           date.getMonth() === month - 1 &&
           date.getFullYear() === year &&
           year >= 1900 && year <= 2100;
  } catch {
    return false;
  }
};