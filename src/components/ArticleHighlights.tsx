import React from 'react';
import { AlertTriangle, Zap } from 'lucide-react';

interface Highlight {
  text: string;
  type: 'emotional' | 'bias';
  explanation: string;
}

interface ArticleHighlightsProps {
  highlights: Highlight[];
}

export const ArticleHighlights: React.FC<ArticleHighlightsProps> = ({ highlights }) => {
  return (
    <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20">
      <h3 className="text-xl font-semibold text-white mb-4">Content Analysis</h3>
      <div className="space-y-3">
        {highlights.map((highlight, index) => (
          <div
            key={index}
            className="backdrop-blur-md bg-white/5 rounded-lg p-4 border border-white/10"
          >
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg ${
                highlight.type === 'emotional' ? 'bg-yellow-500/20' : 'bg-red-500/20'
              }`}>
                {highlight.type === 'emotional' ? (
                  <Zap className="w-4 h-4 text-yellow-400" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    highlight.type === 'emotional' 
                      ? 'bg-yellow-500/20 text-yellow-400' 
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {highlight.type === 'emotional' ? 'Emotional Language' : 'Potential Bias'}
                  </span>
                </div>
                <p className="text-white font-medium mb-1">"{highlight.text}"</p>
                <p className="text-gray-300 text-sm">{highlight.explanation}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};