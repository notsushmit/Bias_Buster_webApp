import React from 'react';
import { Search, BarChart3, Database, Settings, Moon, Sun } from 'lucide-react';
import { useBias } from '../context/BiasContext';

interface HeaderProps {
  activeTab: 'analyzer' | 'dashboard' | 'sources' | 'settings';
  setActiveTab: (tab: 'analyzer' | 'dashboard' | 'sources' | 'settings') => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const { darkMode, setDarkMode } = useBias();

  const tabs = [
    { id: 'analyzer', label: 'Article Analyzer', icon: Search },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'sources', label: 'Source Directory', icon: Database },
    { id: 'settings', label: 'API Settings', icon: Settings },
  ];

  return (
    <header className="backdrop-blur-md bg-white/10 border-b border-white/20 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg flex items-center justify-center">
                <Search className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                Bias Buster
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
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 hover:bg-white/20 ${
                    activeTab === tab.id
                      ? 'bg-white/20 text-white shadow-lg'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </nav>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </header>
  );
};