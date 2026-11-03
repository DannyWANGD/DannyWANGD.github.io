import { createContext } from 'react';
import type { Language } from './messages';

export const LANGUAGE_STORAGE_KEY = 'site-language';
export const LanguageContext = createContext<{ language: Language; setLanguage: (language: Language) => void } | null>(null);

export type Translations<T> = { translations?: Partial<Record<Language, Partial<T>>> };
export function localize<T>(value: T & Translations<T>, language: Language): T {
  return { ...value, ...value.translations?.[language] };
}
