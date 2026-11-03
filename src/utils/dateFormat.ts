export const formatDate = (dateString: string, language = 'en'): string => {
  if (!dateString) return '';
  const date = new Date(`${dateString.length === 7 ? `${dateString}-01` : dateString}T00:00:00Z`);
  return Number.isNaN(date.getTime()) ? dateString : new Intl.DateTimeFormat(language, { year: 'numeric', month: 'short', ...(dateString.length > 7 ? { day: 'numeric' } : {}), timeZone: 'UTC' }).format(date);
};
