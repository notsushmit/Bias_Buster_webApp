import React, { useState } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useBias } from '../context/BiasContext';

export const LanguageSelector: React.FC = () => {
  const { currentLanguage, setLanguage, languages, t } = useLanguage();
  const { darkMode } = useBias();
  const [isOpen, setIsOpen] = useState(false);

  const currentLang = languages.find(lang => lang.code === currentLanguage);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
          darkMode 
            ? 'bg-white/10 hover:bg-white/20 text-white' 
            : 'bg-black/10 hover:bg-black/20 text-gray-900'
        }`}
        title={t('common.language')}
      >
        <Globe className="w-4 h-4" />
        <span className="text-lg">{currentLang?.flag}</span>
        <span className="hidden sm:inline text-sm font-medium">
          {currentLang?.nativeName}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className={`absolute right-0 top-full mt-2 w-48 rounded-2xl border backdrop-blur-xl shadow-2xl z-50 overflow-hidden ${
            darkMode 
              ? 'bg-white/10 border-white/20' 
              : 'bg-white/90 border-gray-200/50'
          }`}>
            <div className="py-2">
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => {
                    setLanguage(language.code);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-all duration-200 ${
                    currentLanguage === language.code
                      ? darkMode
                        ? 'bg-blue-500/20 text-blue-300'
                        : 'bg-blue-500/10 text-blue-600'
                      : darkMode
                        ? 'hover:bg-white/10 text-white'
                        : 'hover:bg-gray-100 text-gray-900'
                  }`}
                >
                  <span className="text-lg">{language.flag}</span>
                  <div className="flex-1">
                    <div className="font-medium">{language.nativeName}</div>
                    <div className={`text-xs ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {language.name}
                    </div>
                  </div>
                  {currentLanguage === language.code && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};