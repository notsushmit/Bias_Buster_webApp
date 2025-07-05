import React from 'react';
import { Search, BarChart3, Database, Settings } from 'lucide-react';
import { useBias } from '../context/BiasContext';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSelector } from './LanguageSelector';
import { ThemeSwitcher } from './ThemeSwitcher';
import { TextToSpeechControls } from './TextToSpeechControls';

interface HeaderProps {
  activeTab: 'analyzer' | 'dashboard' | 'sources' | 'settings';
  setActiveTab: (tab: 'analyzer' | 'dashboard' | 'sources' | 'settings') => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const { darkMode } = useBias();
  const { t } = useLanguage();

  const tabs = [
    { id: 'analyzer', label: t('header.articleAnalyzer'), icon: Search },
    { id: 'dashboard', label: t('header.dashboard'), icon: BarChart3 },
    { id: 'sources', label: t('header.sourceDirectory'), icon: Database },
    { id: 'settings', label: t('header.apiSettings'), icon: Settings },
  ];

  return (
    <header className={`backdrop-blur-md border-b sticky top-0 z-50 transition-colors duration-300 ${
      darkMode 
        ? 'bg-white/10 border-white/20' 
        : 'bg-black/10 border-black/20'
    }`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg flex items-center justify-center">
                <Search className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                {t('header.title')}
              </h1>
            </div>
          </div>

          <nav className="flex items-center space-x-1">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    darkMode 
                      ? 'hover:bg-white/20 focus:ring-blue-400' 
                      : 'hover:bg-black/10 focus:ring-blue-500'
                  } ${
                    activeTab === tab.id
                      ? darkMode 
                        ? 'bg-white/20 text-white shadow-lg' 
                        : 'bg-black/10 text-gray-900 shadow-lg'
                      : darkMode 
                        ? 'text-gray-300 hover:text-white' 
                        : 'text-gray-600 hover:text-gray-900'
                  }`}
                  aria-current={activeTab === tab.id ? 'page' : undefined}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="flex items-center space-x-3">
            <TextToSpeechControls />
            <LanguageSelector />
            <ThemeSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
};