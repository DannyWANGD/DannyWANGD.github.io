import { format, parseISO } from 'date-fns';

export const formatDate = (dateString: string): string => {
  try {
    return format(parseISO(dateString), 'MMMM d, yyyy');
  } catch (error) {
    return dateString;
  }
};