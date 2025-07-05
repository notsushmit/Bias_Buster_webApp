import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SupportedLanguage, LanguageConfig } from '../types/language';
import { translations } from '../locales';

interface LanguageContextType {
  currentLanguage: SupportedLanguage;
  setLanguage: (language: SupportedLanguage) => void;
  t: (key: string, params?: Record<string, string>) => string;
  languages: LanguageConfig[];
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const supportedLanguages: LanguageConfig[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', rtl: false },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', rtl: false },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', rtl: false },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', rtl: false },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', rtl: false },
];

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>(() => {
    // Check localStorage first, then browser language, then default to English
    const saved = localStorage.getItem('selectedLanguage') as SupportedLanguage;
    if (saved && supportedLanguages.some(lang => lang.code === saved)) {
      return saved;
    }
    
    // Try to detect browser language
    const browserLang = navigator.language.split('-')[0] as SupportedLanguage;
    if (supportedLanguages.some(lang => lang.code === browserLang)) {
      return browserLang;
    }
    
    return 'en';
  });

  const setLanguage = (language: SupportedLanguage) => {
    setCurrentLanguage(language);
    localStorage.setItem('selectedLanguage', language);
    
    // Update document language and direction
    document.documentElement.lang = language;
    const config = supportedLanguages.find(lang => lang.code === language);
    document.documentElement.dir = config?.rtl ? 'rtl' : 'ltr';
  };

  // Translation function with parameter interpolation
  const t = (key: string, params?: Record<string, string>): string => {
    const keys = key.split('.');
    let value: any = translations[currentLanguage];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to English if translation not found
        value = translations.en;
        for (const fallbackKey of keys) {
          if (value && typeof value === 'object' && fallbackKey in value) {
            value = value[fallbackKey];
          } else {
            return key; // Return key if no translation found
          }
        }
        break;
      }
    }
    
    if (typeof value !== 'string') {
      return key;
    }
    
    // Replace parameters in the translation
    if (params) {
      return Object.entries(params).reduce((str, [param, replacement]) => {
        return str.replace(new RegExp(`{{${param}}}`, 'g'), replacement);
      }, value);
    }
    
    return value;
  };

  const currentConfig = supportedLanguages.find(lang => lang.code === currentLanguage);

  useEffect(() => {
    // Set initial document language and direction
    document.documentElement.lang = currentLanguage;
    document.documentElement.dir = currentConfig?.rtl ? 'rtl' : 'ltr';
  }, [currentLanguage, currentConfig]);

  return (
    <LanguageContext.Provider value={{
      currentLanguage,
      setLanguage,
      t,
      languages: supportedLanguages,
      isRTL: currentConfig?.rtl || false
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};