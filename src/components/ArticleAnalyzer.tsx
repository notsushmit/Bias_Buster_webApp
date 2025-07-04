import React, { useState } from 'react';
import { Link, AlertTriangle, TrendingUp, Eye, ExternalLink, Loader2 } from 'lucide-react';
import { BiasVisualization } from './BiasVisualization';
import { ComparativeCoverage } from './ComparativeCoverage';
import { ArticleHighlights } from './ArticleHighlights';
import { SourceModal } from './SourceModal';
import { SocialReactions } from './SocialReactions';
import { extractArticleFromUrl } from '../services/articleExtractor';
import { analyzeArticleBias } from '../services/biasDetection';
import { fetchRelatedArticles, getSourceBiasRating } from '../services/newsApi';
import { fetchAllSocialReactions } from '../services/socialMedia';

export const ArticleAnalyzer: React.FC = () => {
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
        throw new Error('Unable to extract article content from the provided URL');
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
      setError(err instanceof Error ? err.message : 'An error occurred during analysis');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
          Article Bias Analysis
        </h2>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Paste any news article URL to instantly analyze its bias, factuality, and see how other sources cover the same story.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20">
          <div className="flex space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Link className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Enter news article URL..."
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                />
              </div>
            </div>
            <button
              onClick={handleAnalyze}
              disabled={!url || analyzing}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
            >
              {analyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  <span>Analyze</span>
                </>
              )}
            </button>
          </div>
          
          {error && (
            <div className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <span className="text-red-300">{error}</span>
              </div>
            </div>
          )}
        </div>

        {analysisResult && (
          <div className="mt-8 space-y-6">
            <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {analysisResult.article.title}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-300 mb-2">
                    <span>Source: {analysisResult.article.source}</span>
                    <span>Author: {analysisResult.article.author}</span>
                    <span>Published: {new Date(analysisResult.article.publishDate).toLocaleDateString()}</span>
                  </div>
                  <a
                    href={analysisResult.article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 text-sm"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>View Original Article</span>
                  </a>
                </div>
                {analysisResult.article.imageUrl && (
                  <img
                    src={analysisResult.article.imageUrl}
                    alt="Article"
                    className="w-24 h-24 object-cover rounded-lg ml-4"
                  />
                )}
              </div>

              <BiasVisualization biasData={analysisResult.biasScore} />
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
      </div>

      {selectedSource && (
        <SourceModal
          source={selectedSource}
          onClose={() => setSelectedSource(null)}
        />
      )}
    </div>
  );
};