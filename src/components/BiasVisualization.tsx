import React from 'react';
import { TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle } from 'lucide-react';

interface BiasVisualizationProps {
  biasData: {
    political: number;
    factual: number;
    emotional: number;
  };
}

export const BiasVisualization: React.FC<BiasVisualizationProps> = ({ biasData }) => {
  const getPoliticalBias = (score: number) => {
    if (score <= -3) return { label: 'Left', color: 'bg-blue-500', icon: TrendingDown };
    if (score <= -1) return { label: 'Center-Left', color: 'bg-blue-400', icon: TrendingDown };
    if (score <= 1) return { label: 'Center', color: 'bg-gray-500', icon: Minus };
    if (score <= 3) return { label: 'Center-Right', color: 'bg-red-400', icon: TrendingUp };
    return { label: 'Right', color: 'bg-red-500', icon: TrendingUp };
  };

  const getFactualityColor = (score: number) => {
    if (score >= 8) return 'bg-green-500';
    if (score >= 6) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getEmotionalColor = (score: number) => {
    if (score <= 2) return 'bg-green-500';
    if (score <= 4) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const political = getPoliticalBias(biasData.political);
  const PoliticalIcon = political.icon;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="backdrop-blur-md bg-white/5 rounded-lg p-4 border border-white/10">
        <div className="flex items-center space-x-2 mb-2">
          <PoliticalIcon className="w-5 h-5 text-white" />
          <h4 className="font-semibold text-white">Political Bias</h4>
        </div>
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${political.color}`}></div>
          <span className="text-sm text-gray-300">{political.label}</span>
        </div>
        <div className="mt-2 bg-gray-700 rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${political.color}`}
            style={{ width: `${Math.min(Math.abs(biasData.political) * 20, 100)}%` }}
          ></div>
        </div>
      </div>

      <div className="backdrop-blur-md bg-white/5 rounded-lg p-4 border border-white/10">
        <div className="flex items-center space-x-2 mb-2">
          <CheckCircle className="w-5 h-5 text-white" />
          <h4 className="font-semibold text-white">Factuality</h4>
        </div>
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${getFactualityColor(biasData.factual)}`}></div>
          <span className="text-sm text-gray-300">{biasData.factual}/10</span>
        </div>
        <div className="mt-2 bg-gray-700 rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${getFactualityColor(biasData.factual)}`}
            style={{ width: `${biasData.factual * 10}%` }}
          ></div>
        </div>
      </div>

      <div className="backdrop-blur-md bg-white/5 rounded-lg p-4 border border-white/10">
        <div className="flex items-center space-x-2 mb-2">
          <AlertTriangle className="w-5 h-5 text-white" />
          <h4 className="font-semibold text-white">Emotional Language</h4>
        </div>
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${getEmotionalColor(biasData.emotional)}`}></div>
          <span className="text-sm text-gray-300">{biasData.emotional}/10</span>
        </div>
        <div className="mt-2 bg-gray-700 rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${getEmotionalColor(biasData.emotional)}`}
            style={{ width: `${biasData.emotional * 10}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};