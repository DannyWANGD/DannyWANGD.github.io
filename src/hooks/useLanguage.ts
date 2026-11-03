import { useContext } from 'react';
import { LanguageContext } from '../i18n/context';
import { messages } from '../i18n/messages';

export default function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('LanguageProvider is required.');
  return { ...context, t: messages[context.language] };
}
