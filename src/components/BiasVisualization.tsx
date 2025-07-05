import React from 'react';
import { TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle, Shield } from 'lucide-react';
import { useBias } from '../context/BiasContext';

interface BiasVisualizationProps {
  biasData: {
    political: number;
    factual: number;
    emotional: number;
  };
}

export const BiasVisualization: React.FC<BiasVisualizationProps> = ({ biasData }) => {
  const { darkMode } = useBias();
  
  const getPoliticalBias = (score: number) => {
    if (score <= -3) return { label: 'Left', color: 'from-blue-500 to-blue-600', icon: TrendingDown };
    if (score <= -1) return { label: 'Center-Left', color: 'from-blue-400 to-blue-500', icon: TrendingDown };
    if (score <= 1) return { label: 'Center', color: 'from-gray-400 to-gray-500', icon: Minus };
    if (score <= 3) return { label: 'Center-Right', color: 'from-red-400 to-red-500', icon: TrendingUp };
    return { label: 'Right', color: 'from-red-500 to-red-600', icon: TrendingUp };
  };

  const getFactualityData = (score: number) => {
    if (score >= 8) return { label: 'High', color: 'from-green-500 to-green-600', icon: CheckCircle };
    if (score >= 6) return { label: 'Medium', color: 'from-yellow-500 to-yellow-600', icon: Shield };
    return { label: 'Low', color: 'from-red-500 to-red-600', icon: AlertTriangle };
  };

  const getEmotionalData = (score: number) => {
    if (score <= 2) return { label: 'Low', color: 'from-green-500 to-green-600', icon: CheckCircle };
    if (score <= 4) return { label: 'Medium', color: 'from-yellow-500 to-yellow-600', icon: Shield };
    return { label: 'High', color: 'from-red-500 to-red-600', icon: AlertTriangle };
  };

  const political = getPoliticalBias(biasData.political);
  const factual = getFactualityData(biasData.factual);
  const emotional = getEmotionalData(biasData.emotional);
  
  const PoliticalIcon = political.icon;
  const FactualIcon = factual.icon;
  const EmotionalIcon = emotional.icon;

  const metrics = [
    {
      title: 'Political Bias',
      value: political.label,
      score: Math.abs(biasData.political),
      maxScore: 5,
      icon: PoliticalIcon,
      gradient: political.color,
      description: 'Political leaning detected in content'
    },
    {
      title: 'Factuality',
      value: `${biasData.factual}/10`,
      score: biasData.factual,
      maxScore: 10,
      icon: FactualIcon,
      gradient: factual.color,
      description: 'Reliability and accuracy assessment'
    },
    {
      title: 'Emotional Language',
      value: emotional.label,
      score: biasData.emotional,
      maxScore: 10,
      icon: EmotionalIcon,
      gradient: emotional.color,
      description: 'Emotional intensity in language'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        const percentage = (metric.score / metric.maxScore) * 100;
        
        return (
          <div
            key={index}
            className={`relative overflow-hidden rounded-2xl border backdrop-blur-xl transition-all duration-300 hover:scale-105 group ${
              darkMode 
                ? 'bg-white/5 border-white/10 hover:bg-white/10' 
                : 'bg-white/80 border-gray-200/50 hover:bg-white/90'
            }`}
          >
            {/* Gradient Background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${metric.gradient} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
            
            <div className="relative p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${metric.gradient} flex items-center justify-center shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {metric.value}
                </div>
              </div>
              
              {/* Title and Description */}
              <div className="mb-4">
                <h4 className={`font-semibold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {metric.title}
                </h4>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {metric.description}
                </p>
              </div>
              
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className={`h-2 rounded-full overflow-hidden ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-200'
                }`}>
                  <div 
                    className={`h-full bg-gradient-to-r ${metric.gradient} transition-all duration-1000 ease-out rounded-full`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs">
                  <span className={darkMode ? 'text-gray-500' : 'text-gray-400'}>0</span>
                  <span className={darkMode ? 'text-gray-500' : 'text-gray-400'}>{metric.maxScore}</span>
                </div>
              </div>
            </div>
            
            {/* Hover Effect Border */}
            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${metric.gradient} opacity-0 group-hover:opacity-20 transition-opacity pointer-events-none`}></div>
          </div>
        );
      })}
    </div>
  );
};