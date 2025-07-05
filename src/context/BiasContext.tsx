import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ColorblindTheme = 'default' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'monochrome' | 'high-contrast';

interface BiasContextType {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  colorblindTheme: ColorblindTheme;
  setColorblindTheme: (theme: ColorblindTheme) => void;
  alerts: any[];
  setAlerts: (alerts: any[]) => void;
  bookmarks: any[];
  setBookmarks: (bookmarks: any[]) => void;
}

const BiasContext = createContext<BiasContextType | undefined>(undefined);

export const BiasProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    // Check localStorage first, then system preference
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) {
      return JSON.parse(saved);
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [colorblindTheme, setColorblindTheme] = useState<ColorblindTheme>(() => {
    const saved = localStorage.getItem('colorblindTheme') as ColorblindTheme;
    return saved || 'default';
  });
  
  const [alerts, setAlerts] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);

  // Save to localStorage and apply theme when darkMode changes
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    
    // Apply theme to document
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Save and apply colorblind theme
  useEffect(() => {
    localStorage.setItem('colorblindTheme', colorblindTheme);
    document.documentElement.setAttribute('data-colorblind-theme', colorblindTheme);
    
    // Apply theme-specific CSS custom properties
    const root = document.documentElement;
    
    switch (colorblindTheme) {
      case 'protanopia':
        root.style.setProperty('--color-primary', '#0ea5e9');
        root.style.setProperty('--color-secondary', '#f59e0b');
        root.style.setProperty('--color-accent', '#84cc16');
        root.style.setProperty('--color-success', '#84cc16');
        root.style.setProperty('--color-warning', '#f59e0b');
        root.style.setProperty('--color-error', '#0ea5e9');
        break;
      case 'deuteranopia':
        root.style.setProperty('--color-primary', '#0ea5e9');
        root.style.setProperty('--color-secondary', '#f59e0b');
        root.style.setProperty('--color-accent', '#a855f7');
        root.style.setProperty('--color-success', '#0ea5e9');
        root.style.setProperty('--color-warning', '#f59e0b');
        root.style.setProperty('--color-error', '#a855f7');
        break;
      case 'tritanopia':
        root.style.setProperty('--color-primary', '#ef4444');
        root.style.setProperty('--color-secondary', '#f59e0b');
        root.style.setProperty('--color-accent', '#84cc16');
        root.style.setProperty('--color-success', '#84cc16');
        root.style.setProperty('--color-warning', '#f59e0b');
        root.style.setProperty('--color-error', '#ef4444');
        break;
      case 'monochrome':
        root.style.setProperty('--color-primary', '#6b7280');
        root.style.setProperty('--color-secondary', '#374151');
        root.style.setProperty('--color-accent', '#111827');
        root.style.setProperty('--color-success', '#6b7280');
        root.style.setProperty('--color-warning', '#374151');
        root.style.setProperty('--color-error', '#111827');
        break;
      case 'high-contrast':
        root.style.setProperty('--color-primary', darkMode ? '#ffffff' : '#000000');
        root.style.setProperty('--color-secondary', '#ffff00');
        root.style.setProperty('--color-accent', '#ff00ff');
        root.style.setProperty('--color-success', '#00ff00');
        root.style.setProperty('--color-warning', '#ffff00');
        root.style.setProperty('--color-error', '#ff0000');
        break;
      default:
        root.style.setProperty('--color-primary', '#3b82f6');
        root.style.setProperty('--color-secondary', '#8b5cf6');
        root.style.setProperty('--color-accent', '#ec4899');
        root.style.setProperty('--color-success', '#22c55e');
        root.style.setProperty('--color-warning', '#f59e0b');
        root.style.setProperty('--color-error', '#ef4444');
    }
  }, [colorblindTheme, darkMode]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      // Only update if user hasn't manually set a preference
      const saved = localStorage.getItem('darkMode');
      if (saved === null) {
        setDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <BiasContext.Provider value={{
      darkMode,
      setDarkMode,
      colorblindTheme,
      setColorblindTheme,
      alerts,
      setAlerts,
      bookmarks,
      setBookmarks
    }}>
      {children}
    </BiasContext.Provider>
  );
};

export const useBias = () => {
  const context = useContext(BiasContext);
  if (context === undefined) {
    throw new Error('useBias must be used within a BiasProvider');
  }
  return context;
};