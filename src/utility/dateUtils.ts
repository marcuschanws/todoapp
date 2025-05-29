import { format } from 'date-fns-tz';
import { parseISO } from 'date-fns';

// Format UTC date to user's local time
export const formatToLocal = (utcDateString: string | null | undefined): string => {
  if (!utcDateString) 
    return 'No deadline';
  
  try {
    const date = parseISO(utcDateString);
    return format(date, 'dd-MM-yyyy HH:mm');
  } catch {
    return 'Invalid date';
  }
};

// Format for datetime-local input (yyyy-MM-ddTHH:mm)
export const formatForInput = (utcDateString: string | null | undefined): string => {
  if (!utcDateString) 
    return '';
  
  try {
    const date = parseISO(utcDateString);
    return format(date, "yyyy-MM-dd'T'HH:mm");
  } catch {
    return '';
  }
};

// Convert local datetime to UTC ISO string
export const localToUTCISO = (localDateTime: string): string | undefined => {
  if (!localDateTime) 
    return undefined;
  
  try {
    const date = new Date(localDateTime);
    return date.toISOString();
  } catch {
    return undefined;
  }
};