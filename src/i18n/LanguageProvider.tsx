import { useEffect, useState, type ReactNode } from 'react';
import { LanguageContext, LANGUAGE_STORAGE_KEY } from './context';
import type { Language } from './messages';

export default function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    try { return typeof window !== 'undefined' && sessionStorage.getItem(LANGUAGE_STORAGE_KEY) === 'zh-CN' ? 'zh-CN' : 'en'; }
    catch { return 'en'; }
  });

  useEffect(() => {
    document.documentElement.lang = language;
    try { sessionStorage.setItem(LANGUAGE_STORAGE_KEY, language); } catch { /* Switching also works without browser storage. */ }
  }, [language]);

  return <LanguageContext.Provider value={{ language, setLanguage }}>{children}</LanguageContext.Provider>;
}
