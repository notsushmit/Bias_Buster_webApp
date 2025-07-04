import React from 'react';
import { ExternalLink, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface CoverageItem {
  source: string;
  bias: string;
  headline: string;
  factuality: number;
  sentiment: string;
}

interface ComparativeCoverageProps {
  coverage: CoverageItem[];
  onSourceClick: (source: CoverageItem) => void;
}

export const ComparativeCoverage: React.FC<ComparativeCoverageProps> = ({ coverage, onSourceClick }) => {
  const getBiasColor = (bias: string) => {
    switch (bias) {
      case 'left': return 'bg-blue-500';
      case 'center-left': return 'bg-blue-400';
      case 'center': return 'bg-gray-500';
      case 'center-right': return 'bg-red-400';
      case 'right': return 'bg-red-500';
      default: return 'bg-gray-500';
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
      case 'neutral': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20">
      <h3 className="text-xl font-semibold text-white mb-4">Comparative Coverage</h3>
      <div className="space-y-4">
        {coverage.map((item, index) => {
          const BiasIcon = getBiasIcon(item.bias);
          return (
            <div
              key={index}
              className="backdrop-blur-md bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-all duration-200 cursor-pointer"
              onClick={() => onSourceClick(item)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className={`w-3 h-3 rounded-full ${getBiasColor(item.bias)}`}></div>
                    <BiasIcon className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-white">{item.source}</span>
                    <span className="text-xs text-gray-400 capitalize">{item.bias}</span>
                  </div>
                  <h4 className="text-white font-medium mb-2">{item.headline}</h4>
                  <div className="flex items-center space-x-4 text-xs text-gray-400">
                    <span>Factuality: {item.factuality}/10</span>
                    <span className={`capitalize ${getSentimentColor(item.sentiment)}`}>
                      {item.sentiment}
                    </span>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400 hover:text-white transition-colors" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};