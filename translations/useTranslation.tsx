import React, { createContext, useContext, useState, ReactNode } from 'react';
import { translations, TranslationKeys } from './translations';

// Re-export the Language type
import { Language } from './translations';
export { Language };

// Simple mock for AsyncStorage since we don't have it installed
const mockAsyncStorage = {
  getItem: (_key: string) => Promise.resolve(null),
  setItem: (_key: string, _value: string) => Promise.resolve(),
};

type TranslationContextType = {
  language: Language;
  t: (key: keyof TranslationKeys) => string;
  changeLanguage: (language: Language) => void;
};

const defaultLanguage: Language = 'kk'; // Default to Kazakh

const TranslationContext = createContext<TranslationContextType>({
  language: defaultLanguage,
  t: (key) => String(key), // Default implementation
  changeLanguage: () => {},
});

export const TranslationProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(defaultLanguage);

  React.useEffect(() => {
    // Load saved language preference when app starts
    const loadLanguage = async () => {
      try {
        const savedLanguage = await mockAsyncStorage.getItem('userLanguage');
        if (savedLanguage && (savedLanguage === 'kk' || savedLanguage === 'ru' || savedLanguage === 'en')) {
          setLanguage(savedLanguage as Language);
        }
      } catch (error) {
        console.error('Failed to load language preference', error);
      }
    };

    loadLanguage();
  }, []);

  const changeLanguage = async (newLanguage: Language) => {
    setLanguage(newLanguage);
    try {
      await mockAsyncStorage.setItem('userLanguage', newLanguage);
    } catch (error) {
      console.error('Failed to save language preference', error);
    }
  };

  const t = (key: keyof TranslationKeys): string => {
    // Safe access to translations with fallbacks
    return (
      (language in translations && key in translations[language] ? 
        translations[language][key] : 
        ('en' in translations && key in translations.en ? 
          translations.en[key] : 
          String(key)))
    );
  };

  return (
    <TranslationContext.Provider value={{ language, t, changeLanguage }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => useContext(TranslationContext);
