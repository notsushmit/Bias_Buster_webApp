import React from 'react';
import { useBias } from '../context/BiasContext';

export const AuroraBackground: React.FC = () => {
  const { darkMode } = useBias();
  
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute -top-1/2 -left-1/2 w-full h-full">
        <div className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse transition-colors duration-1000 ${
          darkMode 
            ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20' 
            : 'bg-gradient-to-r from-blue-300/30 to-purple-300/30'
        }`}></div>
        <div className={`absolute top-1/2 right-1/4 w-80 h-80 rounded-full blur-3xl animate-pulse delay-1000 transition-colors duration-1000 ${
          darkMode 
            ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20' 
            : 'bg-gradient-to-r from-purple-300/30 to-pink-300/30'
        }`}></div>
        <div className={`absolute bottom-1/4 left-1/2 w-64 h-64 rounded-full blur-3xl animate-pulse delay-2000 transition-colors duration-1000 ${
          darkMode 
            ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20' 
            : 'bg-gradient-to-r from-cyan-300/30 to-blue-300/30'
        }`}></div>
      </div>
      <div className={`absolute top-0 left-0 w-full h-full transition-colors duration-1000 ${
        darkMode 
          ? 'bg-gradient-to-br from-gray-900/50 via-gray-800/50 to-gray-900/50' 
          : 'bg-gradient-to-br from-gray-50/50 via-gray-100/50 to-gray-50/50'
      }`}></div>
    </div>
  );
};