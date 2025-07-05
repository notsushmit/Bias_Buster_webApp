import React, { useState } from 'react';
import { Link, AlertTriangle, TrendingUp, Eye, ExternalLink, Loader2, Sparkles, Zap } from 'lucide-react';
import { BiasVisualization } from './BiasVisualization';
import { ComparativeCoverage } from './ComparativeCoverage';
import { ArticleHighlights } from './ArticleHighlights';
import { SourceModal } from './SourceModal';
import { SocialReactions } from './SocialReactions';
import { extractArticleFromUrl } from '../services/articleExtractor';
import { analyzeArticleBias } from '../services/biasDetection';
import { fetchRelatedArticles, getSourceBiasRating } from '../services/newsApi';
import { fetchAllSocialReactions } from '../services/socialMedia';
import { useBias } from '../context/BiasContext';
import { useLanguage } from '../context/LanguageContext';

export const ArticleAnalyzer: React.FC = () => {
  const { darkMode } = useBias();
  const { t } = useLanguage();
  const [url, setUrl] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [selectedSource, setSelectedSource] = useState<any>(null);
  const [error, setError] = useState<string>('');

  const handleAnalyze = async () => {
    if (!url) return;
    
    setAnalyzing(true);
    setError('');
    
    try {
      // Step 1: Extract article content
      const extractedArticle = await extractArticleFromUrl(url);
      if (!extractedArticle) {
        throw new Error(t('analyzer.errors.extractionFailed'));
      }

      // Step 2: Analyze bias and sentiment
      const biasAnalysis = await analyzeArticleBias(extractedArticle.content, extractedArticle.source);
      
      // Step 3: Get source bias rating
      const sourceBiasRating = getSourceBiasRating(extractedArticle.source);
      
      // Step 4: Fetch related articles from other sources
      const relatedArticles = await fetchRelatedArticles(extractedArticle.title);
      
      // Step 5: Get social media reactions
      const socialReactions = await fetchAllSocialReactions(extractedArticle.title, url);
      
      // Step 6: Process comparative coverage
      const comparativeCoverage = relatedArticles.slice(0, 6).map(article => {
        const sourceRating = getSourceBiasRating(article.source.name);
        return {
          source: article.source.name,
          bias: sourceRating?.bias || 'unknown',
          headline: article.title,
          factuality: sourceRating?.factuality || 5.0,
          sentiment: Math.random() > 0.5 ? 'positive' : Math.random() > 0.5 ? 'negative' : 'neutral',
          url: article.url,
          publishedAt: article.publishedAt
        };
      });

      const result = {
        article: {
          title: extractedArticle.title,
          source: extractedArticle.source,
          publishDate: extractedArticle.publishDate,
          author: extractedArticle.author,
          bias: sourceBiasRating?.bias || 'unknown',
          factuality: biasAnalysis.factuality,
          sentiment: biasAnalysis.sentiment,
          url: url,
          imageUrl: extractedArticle.imageUrl
        },
        biasScore: {
          political: biasAnalysis.politicalBias,
          factual: biasAnalysis.factuality,
          emotional: biasAnalysis.emotionalLanguage
        },
        highlights: biasAnalysis.highlights.map(h => ({
          text: h.text,
          type: h.type,
          explanation: h.explanation
        })),
        comparativeCoverage,
        socialReactions,
        extractedContent: extractedArticle.content
      };
      
      setAnalysisResult(result);
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err instanceof Error ? err.message : t('analyzer.errors.analysisGeneral'));
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6 py-12">
        <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 backdrop-blur-sm">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span className={`text-sm font-medium ${darkMode ? 'text-blue-300' : 'text-blue-600'}`}>
            {t('analyzer.hero.badge')}
          </span>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold leading-tight">
          <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            {t('analyzer.hero.title')}
          </span>
          <br />
          <span className={`${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {t('analyzer.hero.subtitle')}
          </span>
        </h1>
        
        <p className={`text-xl max-w-3xl mx-auto leading-relaxed ${
          darkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          {t('analyzer.hero.description')}
        </p>
      </div>

      {/* Main Input Section */}
      <div className="max-w-4xl mx-auto">
        <div className={`relative overflow-hidden rounded-3xl border backdrop-blur-xl transition-all duration-300 ${
          darkMode 
            ? 'bg-white/5 border-white/10 shadow-2xl shadow-blue-500/10' 
            : 'bg-white/80 border-gray-200/50 shadow-2xl shadow-gray-500/10'
        }`}>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5"></div>
          
          <div className="relative p-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                  <div className="relative">
                    <Link className="absolute left-4 top-4 w-5 h-5 text-gray-400 z-10" />
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder={t('analyzer.hero.placeholder')}
                      className={`w-full pl-12 pr-6 py-4 rounded-2xl border-0 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 text-lg ${
                        darkMode 
                          ? 'bg-white/10 text-white placeholder-gray-400 backdrop-blur-sm' 
                          : 'bg-white/90 text-gray-900 placeholder-gray-500 backdrop-blur-sm'
                      }`}
                    />
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleAnalyze}
                disabled={!url || analyzing}
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-semibold hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-blue-500/25"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl blur opacity-0 group-hover:opacity-50 transition-opacity"></div>
                <div className="relative flex items-center space-x-3">
                  {analyzing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>{t('common.analyzing')}</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      <span>{t('common.analyzeNow')}</span>
                    </>
                  )}
                </div>
              </button>
            </div>
            
            {error && (
              <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl backdrop-blur-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-red-400">{t('analyzer.errors.title')}</h4>
                    <p className={`text-sm ${darkMode ? 'text-red-300' : 'text-red-600'}`}>{error}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Examples */}
        <div className="mt-8 text-center">
          <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {t('analyzer.hero.examples')}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              'https://www.bbc.com/news',
              'https://www.reuters.com',
              'https://www.cnn.com'
            ].map((exampleUrl, index) => (
              <button
                key={index}
                onClick={() => setUrl(exampleUrl)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  darkMode 
                    ? 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                }`}
              >
                {new URL(exampleUrl).hostname.replace('www.', '')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Section */}
      {analysisResult && (
        <div className="space-y-8 animate-fade-in">
          {/* Article Header */}
          <div className={`relative overflow-hidden rounded-3xl border backdrop-blur-xl transition-all duration-300 ${
            darkMode 
              ? 'bg-white/5 border-white/10' 
              : 'bg-white/80 border-gray-200/50'
          }`}>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5"></div>
            
            <div className="relative p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                      <Eye className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {t('analyzer.analysis.complete')}
                      </h2>
                      <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {t('analyzer.analysis.aiResults')}
                      </p>
                    </div>
                  </div>
                  
                  <h3 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {analysisResult.article.title}
                  </h3>
                  
                  <div className={`flex flex-wrap items-center gap-4 text-sm mb-4 ${
                    darkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    <span className="flex items-center space-x-1">
                      <span className="font-medium">{t('analyzer.analysis.source')}:</span>
                      <span>{analysisResult.article.source}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <span className="font-medium">{t('analyzer.analysis.author')}:</span>
                      <span>{analysisResult.article.author}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <span className="font-medium">{t('analyzer.analysis.published')}:</span>
                      <span>{new Date(analysisResult.article.publishDate).toLocaleDateString()}</span>
                    </span>
                  </div>
                  
                  <a
                    href={analysisResult.article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 font-medium transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>{t('common.viewOriginal')}</span>
                  </a>
                </div>
                
                {analysisResult.article.imageUrl && (
                  <div className="ml-6">
                    <img
                      src={analysisResult.article.imageUrl}
                      alt="Article"
                      className="w-32 h-32 object-cover rounded-2xl shadow-lg"
                    />
                  </div>
                )}
              </div>

              <BiasVisualization biasData={analysisResult.biasScore} />
            </div>
          </div>

          <ComparativeCoverage
            coverage={analysisResult.comparativeCoverage}
            onSourceClick={setSelectedSource}
          />

          <ArticleHighlights highlights={analysisResult.highlights} />

          {analysisResult.socialReactions && analysisResult.socialReactions.length > 0 && (
            <SocialReactions reactions={analysisResult.socialReactions} />
          )}
        </div>
      )}

      {selectedSource && (
        <SourceModal
          source={selectedSource}
          onClose={() => setSelectedSource(null)}
        />
      )}
    </div>
  );
};