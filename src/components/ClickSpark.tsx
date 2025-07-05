import React from 'react';

interface ClickSparkProps {
  x: number;
  y: number;
}

export const ClickSpark: React.FC<ClickSparkProps> = ({ x, y }) => {
  return (
    <div
      className="fixed pointer-events-none z-50"
      style={{ left: x - 15, top: y - 15 }}
    >
      <div className="relative">
        <div className="absolute w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full animate-ping opacity-75"></div>
        <div className="absolute w-4 h-4 bg-white rounded-full animate-ping delay-75 opacity-50" style={{ left: 4, top: 4 }}></div>
        <div className="absolute w-2 h-2 bg-blue-300 rounded-full animate-ping delay-150" style={{ left: 8, top: 8 }}></div>
      </div>
    </div>
  );
};