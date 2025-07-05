import React from 'react';
import { ExternalLink, TrendingUp, TrendingDown, Minus, Clock, Users } from 'lucide-react';
import { useBias } from '../context/BiasContext';

interface CoverageItem {
  source: string;
  bias: string;
  headline: string;
  factuality: number;
  sentiment: string;
  url?: string;
  publishedAt?: string;
}

interface ComparativeCoverageProps {
  coverage: CoverageItem[];
  onSourceClick: (source: CoverageItem) => void;
}

export const ComparativeCoverage: React.FC<ComparativeCoverageProps> = ({ coverage, onSourceClick }) => {
  const { darkMode } = useBias();
  
  const getBiasColor = (bias: string) => {
    switch (bias) {
      case 'left': return 'from-blue-500 to-blue-600';
      case 'center-left': return 'from-blue-400 to-blue-500';
      case 'center': return 'from-gray-400 to-gray-500';
      case 'center-right': return 'from-red-400 to-red-500';
      case 'right': return 'from-red-500 to-red-600';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const getBiasIcon = (bias: string) => {
    if (bias.includes('left')) return TrendingDown;
    if (bias.includes('right')) return TrendingUp;
    return Minus;
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-400';
      case 'negative': return 'text-red-400';
      case 'neutral': return darkMode ? 'text-gray-400' : 'text-gray-600';
      default: return darkMode ? 'text-gray-400' : 'text-gray-600';
    }
  };

  return (
    <div className={`relative overflow-hidden rounded-3xl border backdrop-blur-xl transition-all duration-300 ${
      darkMode 
        ? 'bg-white/5 border-white/10' 
        : 'bg-white/80 border-gray-200/50'
    }`}>
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-blue-500/5 to-cyan-500/5"></div>
      
      <div className="relative p-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Comparative Coverage
            </h3>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              How different sources frame this story
            </p>
          </div>
        </div>
        
        {/* Coverage Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {coverage.map((item, index) => {
            const BiasIcon = getBiasIcon(item.bias);
            const biasGradient = getBiasColor(item.bias);
            
            return (
              <div
                key={index}
                onClick={() => onSourceClick(item)}
                className={`group relative overflow-hidden rounded-2xl border backdrop-blur-sm transition-all duration-300 hover:scale-105 cursor-pointer ${
                  darkMode 
                    ? 'bg-white/5 border-white/10 hover:bg-white/10' 
                    : 'bg-white/60 border-gray-200/50 hover:bg-white/80'
                }`}
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${biasGradient} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
                
                <div className="relative p-6">
                  {/* Source Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${biasGradient} flex items-center justify-center shadow-lg`}>
                        <span className="text-white font-bold text-sm">
                          {item.source.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {item.source}
                        </h4>
                        <div className="flex items-center space-x-2">
                          <BiasIcon className="w-3 h-3 text-gray-400" />
                          <span className={`text-xs capitalize ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {item.bias}
                          </span>
                        </div>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-400 transition-colors" />
                  </div>
                  
                  {/* Headline */}
                  <h5 className={`font-medium mb-4 line-clamp-3 group-hover:text-blue-400 transition-colors ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {item.headline}
                  </h5>
                  
                  {/* Metrics */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-xs">
                      <div className="flex items-center space-x-1">
                        <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Factuality:</span>
                        <span className={`font-medium ${
                          item.factuality >= 8 ? 'text-green-400' : 
                          item.factuality >= 6 ? 'text-yellow-400' : 'text-red-400'
                        }`}>
                          {item.factuality}/10
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Tone:</span>
                        <span className={`font-medium capitalize ${getSentimentColor(item.sentiment)}`}>
                          {item.sentiment}
                        </span>
                      </div>
                    </div>
                    
                    {item.publishedAt && (
                      <div className="flex items-center space-x-1 text-xs text-gray-400">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(item.publishedAt).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Hover Border Effect */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${biasGradient} opacity-0 group-hover:opacity-20 transition-opacity pointer-events-none`}></div>
              </div>
            );
          })}
        </div>
        
        {coverage.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <p className={`text-lg font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              No comparative coverage found
            </p>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Try analyzing a more recent or popular article
            </p>
          </div>
        )}
      </div>
    </div>
  );
};