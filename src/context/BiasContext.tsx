import React, { createContext, useContext, useState, ReactNode } from 'react';

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
  const [darkMode, setDarkMode] = useState(true);
  const [alerts, setAlerts] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);

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