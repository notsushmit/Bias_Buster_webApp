import React, { useState } from 'react';
import { Sun, Moon, Eye, Palette, Check, ChevronDown } from 'lucide-react';
import { useBias } from '../context/BiasContext';
import { useLanguage } from '../context/LanguageContext';

export type ColorblindTheme = 'default' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'monochrome' | 'high-contrast';

export const ThemeSwitcher: React.FC = () => {
  const { darkMode, setDarkMode, colorblindTheme, setColorblindTheme } = useBias();
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const themes = [
    { 
      id: 'default' as ColorblindTheme, 
      name: t('accessibility.themes.default'), 
      description: t('accessibility.themes.defaultDesc'),
      icon: Palette,
      colors: ['#3b82f6', '#8b5cf6', '#ec4899']
    },
    { 
      id: 'protanopia' as ColorblindTheme, 
      name: t('accessibility.themes.protanopia'), 
      description: t('accessibility.themes.protanopiaDesc'),
      icon: Eye,
      colors: ['#0ea5e9', '#f59e0b', '#84cc16']
    },
    { 
      id: 'deuteranopia' as ColorblindTheme, 
      name: t('accessibility.themes.deuteranopia'), 
      description: t('accessibility.themes.deuteranopiaDesc'),
      icon: Eye,
      colors: ['#0ea5e9', '#f59e0b', '#a855f7']
    },
    { 
      id: 'tritanopia' as ColorblindTheme, 
      name: t('accessibility.themes.tritanopia'), 
      description: t('accessibility.themes.tritanopiaDesc'),
      icon: Eye,
      colors: ['#ef4444', '#f59e0b', '#84cc16']
    },
    { 
      id: 'monochrome' as ColorblindTheme, 
      name: t('accessibility.themes.monochrome'), 
      description: t('accessibility.themes.monochromeDesc'),
      icon: Eye,
      colors: ['#6b7280', '#374151', '#111827']
    },
    { 
      id: 'high-contrast' as ColorblindTheme, 
      name: t('accessibility.themes.highContrast'), 
      description: t('accessibility.themes.highContrastDesc'),
      icon: Eye,
      colors: ['#000000', '#ffffff', '#ffff00']
    }
  ];

  const currentTheme = themes.find(theme => theme.id === colorblindTheme) || themes[0];

  const handleThemeChange = (themeId: ColorblindTheme) => {
    setColorblindTheme(themeId);
    setIsOpen(false);
    
    // Apply theme to document
    document.documentElement.setAttribute('data-colorblind-theme', themeId);
    
    // Announce change for screen readers
    const announcement = `${t('accessibility.themeChanged')} ${themes.find(t => t.id === themeId)?.name}`;
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.textContent = announcement;
    document.body.appendChild(announcer);
    setTimeout(() => document.body.removeChild(announcer), 1000);
  };

  return (
    <div className="flex items-center space-x-2">
      {/* Dark/Light Mode Toggle */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className={`p-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
          darkMode 
            ? 'bg-white/10 hover:bg-white/20 text-yellow-400 focus:ring-yellow-400' 
            : 'bg-black/10 hover:bg-black/20 text-gray-700 focus:ring-blue-500'
        }`}
        title={darkMode ? t('common.lightMode') : t('common.darkMode')}
        aria-label={darkMode ? t('common.lightMode') : t('common.darkMode')}
      >
        {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>

      {/* Colorblind Theme Selector */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            darkMode 
              ? 'bg-white/10 hover:bg-white/20 text-white focus:ring-blue-400' 
              : 'bg-black/10 hover:bg-black/20 text-gray-900 focus:ring-blue-500'
          }`}
          title={t('accessibility.colorblindSupport')}
          aria-label={t('accessibility.colorblindSupport')}
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <Eye className="w-4 h-4" />
          <div className="flex space-x-1">
            {currentTheme.colors.map((color, index) => (
              <div
                key={index}
                className="w-3 h-3 rounded-full border border-white/20"
                style={{ backgroundColor: color }}
                aria-hidden="true"
              />
            ))}
          </div>
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />
            
            {/* Dropdown */}
            <div 
              className={`absolute right-0 top-full mt-2 w-80 rounded-2xl border backdrop-blur-xl shadow-2xl z-50 overflow-hidden ${
                darkMode 
                  ? 'bg-white/10 border-white/20' 
                  : 'bg-white/90 border-gray-200/50'
              }`}
              role="menu"
              aria-labelledby="theme-selector"
            >
              <div className="p-4">
                <h3 className={`text-sm font-semibold mb-3 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {t('accessibility.colorblindSupport')}
                </h3>
                
                <div className="space-y-2">
                  {themes.map((theme) => {
                    const Icon = theme.icon;
                    const isSelected = colorblindTheme === theme.id;
                    
                    return (
                      <button
                        key={theme.id}
                        onClick={() => handleThemeChange(theme.id)}
                        className={`w-full flex items-center space-x-3 p-3 rounded-xl text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          isSelected
                            ? darkMode
                              ? 'bg-blue-500/20 text-blue-300 ring-1 ring-blue-400'
                              : 'bg-blue-500/10 text-blue-600 ring-1 ring-blue-300'
                            : darkMode
                              ? 'hover:bg-white/10 text-white'
                              : 'hover:bg-gray-100 text-gray-900'
                        }`}
                        role="menuitem"
                        aria-pressed={isSelected}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          isSelected 
                            ? 'bg-blue-500/20' 
                            : darkMode 
                              ? 'bg-white/10' 
                              : 'bg-gray-100'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div className="font-medium truncate">{theme.name}</div>
                            {isSelected && (
                              <Check className="w-4 h-4 text-blue-500 flex-shrink-0" />
                            )}
                          </div>
                          <div className={`text-xs mt-1 ${
                            darkMode ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {theme.description}
                          </div>
                          <div className="flex space-x-1 mt-2">
                            {theme.colors.map((color, index) => (
                              <div
                                key={index}
                                className="w-4 h-4 rounded border border-white/20"
                                style={{ backgroundColor: color }}
                                aria-hidden="true"
                              />
                            ))}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
                
                <div className={`mt-4 p-3 rounded-xl border ${
                  darkMode 
                    ? 'bg-blue-500/10 border-blue-500/20 text-blue-300' 
                    : 'bg-blue-50 border-blue-200 text-blue-700'
                }`}>
                  <div className="flex items-start space-x-2">
                    <Eye className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <div className="text-xs">
                      <div className="font-medium mb-1">{t('accessibility.tip')}</div>
                      <div>{t('accessibility.tipDescription')}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};