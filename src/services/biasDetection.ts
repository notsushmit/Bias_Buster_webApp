import axios from 'axios';

export interface BiasAnalysis {
  politicalBias: number; // -5 to 5 scale
  emotionalLanguage: number; // 0 to 10 scale
  factuality: number; // 0 to 10 scale
  sentiment: 'positive' | 'negative' | 'neutral';
  highlights: Array<{
    text: string;
    type: 'emotional' | 'bias' | 'factual';
    explanation: string;
    startIndex: number;
    endIndex: number;
  }>;
}

// Simple sentiment analysis using keyword matching
export const analyzeSentiment = async (text: string): Promise<{ sentiment: string; confidence: number }> => {
  try {
    const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'positive', 'success', 'achievement', 'progress', 'improvement', 'beneficial', 'effective', 'outstanding', 'remarkable'];
    const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'disgusting', 'outrageous', 'negative', 'failure', 'crisis', 'disaster', 'problem', 'issue', 'concern', 'disappointing', 'devastating'];
    
    const words = text.toLowerCase().split(/\s+/);
    let positiveCount = 0;
    let negativeCount = 0;
    
    words.forEach(word => {
      if (positiveWords.some(pw => word.includes(pw))) positiveCount++;
      if (negativeWords.some(nw => word.includes(nw))) negativeCount++;
    });
    
    const total = positiveCount + negativeCount;
    if (total === 0) return { sentiment: 'neutral', confidence: 0.5 };
    
    const positiveRatio = positiveCount / total;
    
    if (positiveRatio > 0.6) return { sentiment: 'positive', confidence: positiveRatio };
    if (positiveRatio < 0.4) return { sentiment: 'negative', confidence: 1 - positiveRatio };
    return { sentiment: 'neutral', confidence: 0.5 };
  } catch (error) {
    console.error('Error analyzing sentiment:', error);
    return { sentiment: 'neutral', confidence: 0.5 };
  }
};

// Simple toxicity detection using keyword matching
export const analyzeToxicity = async (text: string): Promise<number> => {
  try {
    const toxicWords = ['hate', 'stupid', 'idiot', 'moron', 'disgusting', 'pathetic', 'worthless', 'garbage', 'trash', 'scum'];
    const emotionalWords = ['outrageous', 'shocking', 'devastating', 'catastrophic', 'unprecedented', 'explosive', 'bombshell', 'scandalous'];
    
    const words = text.toLowerCase().split(/\s+/);
    let toxicCount = 0;
    let emotionalCount = 0;
    
    words.forEach(word => {
      if (toxicWords.some(tw => word.includes(tw))) toxicCount++;
      if (emotionalWords.some(ew => word.includes(ew))) emotionalCount++;
    });
    
    const totalWords = words.length;
    const toxicityScore = ((toxicCount * 2 + emotionalCount) / totalWords) * 100;
    
    return Math.min(toxicityScore, 10); // Cap at 10
  } catch (error) {
    console.error('Error analyzing toxicity:', error);
    return 0;
  }
};

// Custom bias detection using keyword analysis
export const detectBiasKeywords = (text: string): Array<{ text: string; type: string; explanation: string; startIndex: number; endIndex: number }> => {
  const biasKeywords = {
    emotional: [
      { word: 'devastating', explanation: 'Emotionally charged adjective' },
      { word: 'shocking', explanation: 'Sensationalized language' },
      { word: 'outrageous', explanation: 'Inflammatory descriptor' },
      { word: 'unprecedented', explanation: 'Hyperbolic language' },
      { word: 'catastrophic', explanation: 'Extreme emotional language' },
      { word: 'miraculous', explanation: 'Overly positive framing' },
      { word: 'stunning', explanation: 'Sensationalized descriptor' },
      { word: 'explosive', explanation: 'Dramatic language' },
      { word: 'bombshell', explanation: 'Sensationalized term' }
    ],
    bias: [
      { word: 'radical', explanation: 'Politically loaded term' },
      { word: 'extremist', explanation: 'Partisan framing' },
      { word: 'liberal elite', explanation: 'Political dog whistle' },
      { word: 'conservative agenda', explanation: 'Partisan characterization' },
      { word: 'fake news', explanation: 'Politically charged phrase' },
      { word: 'mainstream media', explanation: 'Loaded institutional reference' },
      { word: 'deep state', explanation: 'Conspiracy-oriented language' },
      { word: 'establishment', explanation: 'Anti-institutional framing' }
    ]
  };

  const highlights: Array<{ text: string; type: string; explanation: string; startIndex: number; endIndex: number }> = [];
  
  Object.entries(biasKeywords).forEach(([type, keywords]) => {
    keywords.forEach(({ word, explanation }) => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      let match;
      while ((match = regex.exec(text)) !== null) {
        highlights.push({
          text: match[0],
          type,
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
    // Run analyses
    const [sentimentResult, toxicityScore] = await Promise.all([
      analyzeSentiment(content),
      analyzeToxicity(content)
    ]);

    // Detect bias keywords
    const highlights = detectBiasKeywords(content);

    // Calculate political bias based on source and content analysis
    const sourceBias = getSourcePoliticalBias(sourceName);
    const contentBias = calculateContentBias(content);
    const politicalBias = (sourceBias + contentBias) / 2;

    // Calculate factuality based on source reputation and content quality
    const factuality = calculateFactuality(sourceName, content);

    return {
      politicalBias,
      emotionalLanguage: toxicityScore,
      factuality,
      sentiment: sentimentResult.sentiment as 'positive' | 'negative' | 'neutral',
      highlights: highlights.map(h => ({
        ...h,
        type: h.type as 'emotional' | 'bias' | 'factual'
      }))
    };
  } catch (error) {
    console.error('Error analyzing article bias:', error);
    return {
      politicalBias: 0,
      emotionalLanguage: 0,
      factuality: 5,
      sentiment: 'neutral',
      highlights: []
    };
  }
};

// Helper functions
const getSourcePoliticalBias = (sourceName: string): number => {
  const biasMap: Record<string, number> = {
    'fox news': 3,
    'breitbart': 4,
    'daily wire': 3,
    'cnn': -2,
    'msnbc': -3,
    'huffpost': -3,
    'new york times': -1,
    'washington post': -1,
    'wall street journal': 1,
    'reuters': 0,
    'associated press': 0,
    'bbc': -0.5,
    'npr': -1,
    'guardian': -1.5,
    'financial times': 0.5
  };

  const normalizedName = sourceName.toLowerCase();
  for (const [source, bias] of Object.entries(biasMap)) {
    if (normalizedName.includes(source)) {
      return bias;
    }
  }
  return 0;
};

const calculateContentBias = (content: string): number => {
  const leftKeywords = ['progressive', 'social justice', 'climate change', 'inequality', 'diversity', 'inclusion', 'environmental', 'renewable', 'sustainable'];
  const rightKeywords = ['conservative', 'traditional values', 'free market', 'law and order', 'border security', 'fiscal responsibility', 'deregulation'];
  
  const leftCount = leftKeywords.reduce((count, keyword) => 
    count + (content.toLowerCase().match(new RegExp(keyword, 'g')) || []).length, 0);
  const rightCount = rightKeywords.reduce((count, keyword) => 
    count + (content.toLowerCase().match(new RegExp(keyword, 'g')) || []).length, 0);
  
  const total = leftCount + rightCount;
  if (total === 0) return 0;
  
  return ((rightCount - leftCount) / total) * 3; // Scale to -3 to 3
};

const calculateFactuality = (sourceName: string, content: string): number => {
  // Base factuality on source reputation
  const sourceFactuality: Record<string, number> = {
    'reuters': 9.2,
    'associated press': 9.1,
    'bbc': 8.8,
    'npr': 8.9,
    'wall street journal': 8.7,
    'new york times': 8.1,
    'washington post': 8.2,
    'cnn': 7.4,
    'fox news': 6.8,
    'guardian': 8.3,
    'financial times': 8.6
  };

  const normalizedName = sourceName.toLowerCase();
  let baseScore = 7.0; // Default score
  
  for (const [source, score] of Object.entries(sourceFactuality)) {
    if (normalizedName.includes(source)) {
      baseScore = score;
      break;
    }
  }

  // Adjust based on content quality indicators
  const hasSourceCitations = /according to|sources say|reported by|officials said|spokesperson|statement/i.test(content);
  const hasQuotes = /"[^"]*"/g.test(content);
  const hasNumbers = /\d+%|\d+\s*(million|billion|thousand|percent)/g.test(content);
  const hasDateReferences = /yesterday|today|this week|last month|january|february|march|april|may|june|july|august|september|october|november|december/i.test(content);
  
  let adjustment = 0;
  if (hasSourceCitations) adjustment += 0.3;
  if (hasQuotes) adjustment += 0.2;
  if (hasNumbers) adjustment += 0.2;
  if (hasDateReferences) adjustment += 0.1;
  
  return Math.min(10, baseScore + adjustment);
};