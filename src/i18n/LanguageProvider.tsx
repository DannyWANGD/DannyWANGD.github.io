import { useEffect, useState, type ReactNode } from 'react';
import { LanguageContext, LANGUAGE_STORAGE_KEY } from './context';
import type { Language } from './messages';

export default function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    try { return typeof window !== 'undefined' && localStorage.getItem(LANGUAGE_STORAGE_KEY) === 'zh-CN' ? 'zh-CN' : 'en'; }
    catch { return 'en'; }
  });

  useEffect(() => {
    document.documentElement.lang = language;
    try { localStorage.setItem(LANGUAGE_STORAGE_KEY, language); } catch { /* Switching also works without browser storage. */ }
  }, [language]);

  useEffect(() => {
    const sync = (event: StorageEvent) => {
      if (event.key === LANGUAGE_STORAGE_KEY) setLanguage(event.newValue === 'zh-CN' ? 'zh-CN' : 'en');
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  return <LanguageContext.Provider value={{ language, setLanguage }}>{children}</LanguageContext.Provider>;
}
