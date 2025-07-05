import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface BiasContextType {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
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