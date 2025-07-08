import {
  analyzeEmotionalIntensity,
  calculateWeightedEmotionalScore,
  // deriveOverallEmotionalScore, // Alternative scoring, not used for now
} from './emotionAnalysisApi';
import { analyzeFactuality } from './factualityApi';

export interface BiasAnalysis {
  politicalBias: number; // -5 to 5 scale
  emotionalLanguage: number; // 0 to 10 scale
  factuality: number; // 0 to 10 scale
  sentiment: 'positive' | 'negative' | 'neutral'; // This might be refined or derived from emotions
  highlights: Array<{
    text: string;
    type: 'emotional' | 'bias' | 'factual_claim' | 'fact_check_result'; // Added new highlight types
    explanation: string;
    startIndex?: number; // Made optional as new APIs might not provide this easily
    endIndex?: number;   // Made optional
    relatedFactChecks?: any[]; // To store fact check results for a claim
  }>;
  // Optional fields to pass through detailed results if needed by UI
  detailedEmotions?: any;
  detailedFactuality?: any;
}

// Custom bias detection using keyword analysis (remains for political bias term highlighting)
export const detectBiasKeywords = (text: string): Array<{ text: string; type: 'bias'; explanation: string; startIndex: number; endIndex: number }> => {
  const biasKeywords = {
    // emotional and factual keywords are now handled by APIs, this focuses on political bias keywords
    bias: [
      { word: 'radical', explanation: 'Politically loaded term' },
      { word: 'extremist', explanation: 'Partisan framing' },
      { word: 'liberal elite', explanation: 'Political dog whistle' },
      { word: 'conservative agenda', explanation: 'Partisan characterization' },
      { word: 'fake news', explanation: 'Politically charged phrase' },
      { word: 'mainstream media', explanation: 'Loaded institutional reference' },
      { word: 'deep state', explanation: 'Conspiracy-oriented language' },
      { word: 'establishment', explanation: 'Anti-institutional framing' }
      // Add more if needed
    ]
  };

  const highlights: Array<{ text: string; type: 'bias'; explanation: string; startIndex: number; endIndex: number }> = [];
  
  Object.entries(biasKeywords).forEach(([type, keywords]) => {
    keywords.forEach(({ word, explanation }) => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      let match;
      while ((match = regex.exec(text)) !== null) {
        highlights.push({
          text: match[0],
          type: type as 'bias',
          explanation,
          startIndex: match.index,
          endIndex: match.index + match[0].length
        });
      }
    });
  });

  return highlights;
};

// Main bias analysis function
export const analyzeArticleBias = async (content: string, sourceName: string): Promise<BiasAnalysis> => {
  try {
    // Run new analyses for emotional intensity and factuality
    const [emotionResult, factualityResult] = await Promise.all([
      analyzeEmotionalIntensity(content),
      analyzeFactuality(content)
    ]);

    // Calculate emotional language score from detailed emotions
    // Using calculateWeightedEmotionalScore for a more nuanced score.
    const emotionalLanguageScore = calculateWeightedEmotionalScore(emotionResult.emotions || []);

    // The sentiment can be derived from primary emotions if needed, or set to neutral
    // For simplicity, let's determine sentiment based on dominant positive/negative emotions
    let overallSentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
    if (emotionResult.emotions && emotionResult.emotions.length > 0) {
        const positiveEmotions = ['joy', 'admiration', 'love', 'optimism', 'approval', 'caring', 'excitement', 'gratitude', 'relief'];
        const negativeEmotions = ['sadness', 'anger', 'fear', 'disappointment', 'disapproval', 'annoyance', 'grief', 'remorse', 'nervousness'];

        let maxPositiveScore = 0;
        let maxNegativeScore = 0;

        emotionResult.emotions.forEach(e => {
            if (positiveEmotions.includes(e.label.toLowerCase()) && e.score > maxPositiveScore) {
                maxPositiveScore = e.score;
            }
            if (negativeEmotions.includes(e.label.toLowerCase()) && e.score > maxNegativeScore) {
                maxNegativeScore = e.score;
            }
        });

        if (maxPositiveScore > maxNegativeScore && maxPositiveScore > 0.3) { // Threshold to be considered significant
            overallSentiment = 'positive';
        } else if (maxNegativeScore > maxPositiveScore && maxNegativeScore > 0.3) {
            overallSentiment = 'negative';
        }
    }


    // Political bias calculation (existing logic)
    const sourceBias = getSourcePoliticalBias(sourceName);
    const contentBiasScore = calculateContentBias(content); // Renamed for clarity
    const politicalBias = parseFloat(((sourceBias + contentBiasScore) / 2).toFixed(1));

    // Factuality score from the new service
    const factualityScore = factualityResult.derivedFactualityScore;

    // Combine highlights: political bias keywords + key claims + fact check results
    const highlights: BiasAnalysis['highlights'] = [];
    highlights.push(...detectBiasKeywords(content)); // Political bias terms

    // Add key claims from factuality analysis as highlights
    if (factualityResult.keyClaims) {
      factualityResult.keyClaims.forEach(claim => {
        highlights.push({
          text: claim.sentence,
          type: 'factual_claim',
          explanation: `Claim with check-worthiness: ${(claim.checkWorthiness * 100).toFixed(0)}%`,
          // startIndex/endIndex might be hard to get for sentences without more complex NLP
        });
      });
    }
    // Add fact check results as highlights
    // This might need a more sophisticated way to link back to original text,
    // or display them separately. For now, adding as general highlights.
    if (factualityResult.factChecks) {
      factualityResult.factChecks.forEach(fc => {
        highlights.push({
          text: fc.claim,
          type: 'fact_check_result',
          explanation: `Fact Check: ${fc.truthRating || 'Info available'}. Source: ${fc.source || 'N/A'}. ${fc.url ? `Link: ${fc.url}` : ''}`,
          relatedFactChecks: [fc] // Embed the fact check data
        });
      });
    }

    // Filter out highlights with very short text if they are not political bias terms
    // (factual_claim or fact_check_result might be full sentences)
    const finalHighlights = highlights.filter(h => h.type === 'bias' || h.text.length > 20);


    return {
      politicalBias,
      emotionalLanguage: emotionalLanguageScore,
      factuality: factualityScore,
      sentiment: overallSentiment,
      highlights: finalHighlights,
      detailedEmotions: emotionResult, // Pass through for potential detailed UI display
      detailedFactuality: factualityResult, // Pass through
    };

  } catch (error: any) {
    console.error('Error in new analyzeArticleBias:', error);
    return {
      politicalBias: 0,
      emotionalLanguage: 0,
      factuality: 5, // Default neutral factuality on error
      sentiment: 'neutral',
      highlights: [
        { text: "Error during analysis", type: 'bias', explanation: error.message || "Unknown error" }
      ]
    };
  }
};

// Helper functions for political bias (largely unchanged)
const getSourcePoliticalBias = (sourceName: string): number => {
  const biasMap: Record<string, number> = {
    // (Existing biasMap content remains the same)
    'fox news': 3, 'breitbart': 4, 'daily wire': 3, 'cnn': -2, 'msnbc': -3,
    'huffpost': -3, 'new york times': -1, 'washington post': -1,
    'wall street journal': 1, 'reuters': 0, 'associated press': 0,
    'bbc': -0.5, 'npr': -1, 'guardian': -1.5, 'financial times': 0.5
  };

  const normalizedName = sourceName.toLowerCase();
  for (const [source, bias] of Object.entries(biasMap)) {
    if (normalizedName.includes(source)) {
      return bias;
    }
  }
  return 0; // Default to center if source not in map
};

const calculateContentBias = (content: string): number => {
  const leftKeywords = ['progressive', 'social justice', 'climate change', 'inequality', 'diversity', 'inclusion', 'environmental', 'renewable', 'sustainable', 'equity', 'pro-choice', 'regulation'];
  const rightKeywords = ['conservative', 'traditional values', 'free market', 'law and order', 'border security', 'fiscal responsibility', 'deregulation', 'pro-life', 'individual liberty', 'national security'];
  
  const lowerContent = content.toLowerCase();
  let leftScore = 0;
  let rightScore = 0;

  leftKeywords.forEach(keyword => {
    leftScore += (lowerContent.match(new RegExp(`\\b${keyword}\\b`, 'g')) || []).length;
  });
  rightKeywords.forEach(keyword => {
    rightScore += (lowerContent.match(new RegExp(`\\b${keyword}\\b`, 'g')) || []).length;
  });
  
  const total = leftScore + rightScore;
  if (total === 0) return 0;
  
  // Scale: (right - left) / total gives a -1 to 1 score. Multiply by 3 to get -3 to 3.
  // This provides a content-based bias score.
  const contentBias = ((rightScore - leftScore) / total) * 3;
  return contentBias;
};

// Old calculateFactuality and analyzeSentiment/Toxicity are removed as they are replaced by new API calls.