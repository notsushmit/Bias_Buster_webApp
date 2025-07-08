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
  const { darkMode } = useBias();
  const { t } = useLanguage();
  
  if (!highlights || highlights.length === 0) {
    return (
      <div className={`relative overflow-hidden rounded-3xl border backdrop-blur-xl transition-all duration-300 ${
        darkMode 
          ? 'bg-white/5 border-white/10' 
          : 'bg-white/80 border-gray-200/50'
      }`}>
        <div className="relative p-8 text-center">
          <div className="w-16 h-16 bg-gray-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {t('analyzer.highlights.title')}
          </h3>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            No significant bias indicators or emotional language detected in this article.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-3xl border backdrop-blur-xl transition-all duration-300 ${
      darkMode 
        ? 'bg-white/5 border-white/10' 
        : 'bg-white/80 border-gray-200/50'
    }`}>
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-orange-500/5 to-red-500/5"></div>
      
      <div className="relative p-8">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {t('analyzer.highlights.title')}
            </h3>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Detected bias indicators and emotional language
            </p>
          </div>
        </div>
        
        <div className="space-y-4">
        {highlights.map((highlight, index) => (
          <div
            key={index}
            className={`relative overflow-hidden rounded-2xl border backdrop-blur-sm transition-all duration-300 hover:scale-105 ${
              darkMode 
                ? 'bg-white/5 border-white/10 hover:bg-white/10' 
                : 'bg-white/60 border-gray-200/50 hover:bg-white/80'
            }`}
          >
            <div className="relative p-6">
              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${
                  highlight.type === 'emotional' 
                    ? 'bg-gradient-to-br from-yellow-500 to-orange-600' 
                    : highlight.type === 'bias'
                    ? 'bg-gradient-to-br from-red-500 to-pink-600'
                    : 'bg-gradient-to-br from-green-500 to-emerald-600'
              }`}>
                  {highlight.type === 'emotional' ? (
                    <Zap className="w-6 h-6 text-white" />
                  ) : highlight.type === 'bias' ? (
                    <AlertTriangle className="w-6 h-6 text-white" />
                  ) : (
                    <CheckCircle className="w-6 h-6 text-white" />
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      highlight.type === 'emotional' 
                        ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' 
                        : highlight.type === 'bias'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : 'bg-green-500/20 text-green-400 border border-green-500/30'
                    }`}>
                      {highlight.type === 'emotional' 
                        ? t('analyzer.highlights.emotionalLanguage')
                        : highlight.type === 'bias'
                        ? t('analyzer.highlights.potentialBias')
                        : 'Factual Indicator'
                      }
                    </span>
                  </div>
                  
                  <div className={`p-4 rounded-xl border-l-4 mb-3 ${
                    highlight.type === 'emotional'
                      ? darkMode ? 'bg-yellow-500/10 border-yellow-500' : 'bg-yellow-50 border-yellow-500'
                      : highlight.type === 'bias'
                      ? darkMode ? 'bg-red-500/10 border-red-500' : 'bg-red-50 border-red-500'
                      : darkMode ? 'bg-green-500/10 border-green-500' : 'bg-green-50 border-green-500'
                  }`}>
                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      "{highlight.text}"
                    </p>
                  </div>
                  
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {highlight.explanation}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
        </div>
        
        {highlights.length > 5 && (
          <div className={`mt-6 p-4 rounded-xl border ${
            darkMode 
              ? 'bg-blue-500/10 border-blue-500/20 text-blue-300' 
              : 'bg-blue-50 border-blue-200 text-blue-700'
          }`}>
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <div className="font-medium mb-1">Analysis Note</div>
                <div>
                  This article contains multiple bias indicators. Consider reading from multiple sources 
                  to get a more balanced perspective on this topic.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Add missing imports
import { useBias } from '../context/BiasContext';
import { useLanguage } from '../context/LanguageContext';
import { CheckCircle } from 'lucide-react';
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