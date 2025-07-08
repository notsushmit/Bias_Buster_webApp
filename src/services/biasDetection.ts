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

// Enhanced sentiment analysis using multiple approaches
export const analyzeSentiment = async (text: string): Promise<{ sentiment: string; confidence: number; score: number }> => {
  try {
    // Use TextBlob-like approach with word scoring
    const positiveWords = [
      'good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'positive', 'success', 
      'achievement', 'progress', 'improvement', 'beneficial', 'effective', 'outstanding', 
      'remarkable', 'brilliant', 'superb', 'magnificent', 'exceptional', 'impressive',
      'breakthrough', 'victory', 'triumph', 'prosperity', 'flourishing', 'thriving'
    ];
    
    const negativeWords = [
      'bad', 'terrible', 'awful', 'horrible', 'disgusting', 'outrageous', 'negative', 'failure', 
      'crisis', 'disaster', 'problem', 'issue', 'concern', 'disappointing', 'devastating',
      'catastrophic', 'tragic', 'alarming', 'disturbing', 'shocking', 'appalling',
      'scandal', 'corruption', 'fraud', 'violence', 'conflict', 'war', 'death'
    ];

    const intensifiers = ['very', 'extremely', 'incredibly', 'absolutely', 'completely', 'totally', 'utterly'];
    
    const words = text.toLowerCase().split(/\s+/);
    let positiveScore = 0;
    let negativeScore = 0;
    let totalWords = words.length;
    
    for (let i = 0; i < words.length; i++) {
      const word = words[i].replace(/[^\w]/g, '');
      let multiplier = 1;
      
      // Check for intensifiers
      if (i > 0 && intensifiers.includes(words[i - 1])) {
        multiplier = 1.5;
      }
      
      if (positiveWords.some(pw => word.includes(pw))) {
        positiveScore += multiplier;
      }
      if (negativeWords.some(nw => word.includes(nw))) {
        negativeScore += multiplier;
      }
    }
    
    const totalSentimentWords = positiveScore + negativeScore;
    if (totalSentimentWords === 0) {
      return { sentiment: 'neutral', confidence: 0.5, score: 0 };
    }
    
    const positiveRatio = positiveScore / totalSentimentWords;
    const sentimentStrength = totalSentimentWords / totalWords;
    const confidence = Math.min(sentimentStrength * 2, 1);
    
    let sentiment: string;
    let score: number;
    
    if (positiveRatio > 0.6) {
      sentiment = 'positive';
      score = positiveRatio * 5; // Scale to 0-5
    } else if (positiveRatio < 0.4) {
      sentiment = 'negative';
      score = -(1 - positiveRatio) * 5; // Scale to -5-0
    } else {
      sentiment = 'neutral';
      score = 0;
    }
    
    return { sentiment, confidence, score };
  } catch (error) {
    console.error('Error analyzing sentiment:', error);
    return { sentiment: 'neutral', confidence: 0.5, score: 0 };
  }
};

// Enhanced emotional language detection
export const analyzeEmotionalLanguage = async (text: string): Promise<number> => {
  try {
    const emotionalWords = {
      high: ['outrageous', 'shocking', 'devastating', 'catastrophic', 'unprecedented', 'explosive', 
             'bombshell', 'scandalous', 'horrific', 'terrifying', 'incredible', 'unbelievable',
             'mind-blowing', 'earth-shattering', 'jaw-dropping', 'breathtaking'],
      medium: ['concerning', 'troubling', 'worrying', 'surprising', 'remarkable', 'notable',
               'significant', 'important', 'serious', 'major', 'critical', 'urgent'],
      low: ['interesting', 'notable', 'relevant', 'related', 'connected', 'associated']
    };

    const capsPattern = /[A-Z]{3,}/g; // Words in ALL CAPS
    const exclamationPattern = /!{2,}/g; // Multiple exclamation marks
    const questionPattern = /\?{2,}/g; // Multiple question marks
    
    const words = text.toLowerCase().split(/\s+/);
    let emotionalScore = 0;
    
    // Score based on emotional words
    words.forEach(word => {
      const cleanWord = word.replace(/[^\w]/g, '');
      if (emotionalWords.high.some(ew => cleanWord.includes(ew))) {
        emotionalScore += 3;
      } else if (emotionalWords.medium.some(ew => cleanWord.includes(ew))) {
        emotionalScore += 2;
      } else if (emotionalWords.low.some(ew => cleanWord.includes(ew))) {
        emotionalScore += 1;
      }
    });
    
    // Score based on formatting
    const capsMatches = text.match(capsPattern) || [];
    const exclamationMatches = text.match(exclamationPattern) || [];
    const questionMatches = text.match(questionPattern) || [];
    
    emotionalScore += capsMatches.length * 2;
    emotionalScore += exclamationMatches.length * 1.5;
    emotionalScore += questionMatches.length * 1;
    
    // Normalize to 0-10 scale
    const normalizedScore = Math.min((emotionalScore / words.length) * 100, 10);
    
    return normalizedScore;
  } catch (error) {
    console.error('Error analyzing emotional language:', error);
    return 0;
  }
};

// Enhanced bias detection with more comprehensive keyword analysis
export const detectBiasKeywords = (text: string): Array<{ text: string; type: string; explanation: string; startIndex: number; endIndex: number }> => {
  const biasKeywords = {
    emotional: [
      { word: 'devastating', explanation: 'Emotionally charged adjective that may exaggerate impact' },
      { word: 'shocking', explanation: 'Sensationalized language designed to provoke reaction' },
      { word: 'outrageous', explanation: 'Inflammatory descriptor that suggests moral judgment' },
      { word: 'unprecedented', explanation: 'Hyperbolic language that may overstate uniqueness' },
      { word: 'catastrophic', explanation: 'Extreme emotional language that may dramatize events' },
      { word: 'miraculous', explanation: 'Overly positive framing that may lack objectivity' },
      { word: 'stunning', explanation: 'Sensationalized descriptor that adds emotional weight' },
      { word: 'explosive', explanation: 'Dramatic language that may sensationalize content' },
      { word: 'bombshell', explanation: 'Sensationalized term often used for dramatic effect' },
      { word: 'mind-blowing', explanation: 'Hyperbolic expression that may exaggerate significance' },
      { word: 'earth-shattering', explanation: 'Extreme hyperbole that may overstate importance' }
    ],
    bias: [
      { word: 'radical', explanation: 'Politically loaded term often used to dismiss opposing views' },
      { word: 'extremist', explanation: 'Partisan framing that may unfairly characterize positions' },
      { word: 'liberal elite', explanation: 'Political dog whistle targeting specific groups' },
      { word: 'conservative agenda', explanation: 'Partisan characterization that implies hidden motives' },
      { word: 'fake news', explanation: 'Politically charged phrase that dismisses opposing information' },
      { word: 'mainstream media', explanation: 'Loaded institutional reference with political implications' },
      { word: 'deep state', explanation: 'Conspiracy-oriented language that suggests hidden control' },
      { word: 'establishment', explanation: 'Anti-institutional framing with political undertones' },
      { word: 'socialist', explanation: 'Political label often used pejoratively in certain contexts' },
      { word: 'fascist', explanation: 'Extreme political characterization often used inappropriately' },
      { word: 'woke', explanation: 'Politically charged term used to dismiss progressive positions' },
      { word: 'cancel culture', explanation: 'Politically loaded phrase with partisan implications' }
    ],
    factual: [
      { word: 'allegedly', explanation: 'Indicates unverified claims - good journalistic practice' },
      { word: 'reportedly', explanation: 'Shows attribution to sources - responsible reporting' },
      { word: 'according to', explanation: 'Proper source attribution - sign of factual reporting' },
      { word: 'sources say', explanation: 'Indicates reliance on sources - standard journalism' },
      { word: 'confirmed', explanation: 'Suggests verification - positive for factuality' },
      { word: 'verified', explanation: 'Indicates fact-checking - good journalistic practice' }
    ]
  };

  const highlights: Array<{ text: string; type: string; explanation: string; startIndex: number; endIndex: number }> = [];
  
  Object.entries(biasKeywords).forEach(([type, keywords]) => {
    keywords.forEach(({ word, explanation }) => {
      const regex = new RegExp(`\\b${word.replace(/\s+/g, '\\s+')}\\b`, 'gi');
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

// Enhanced political bias detection
export const detectPoliticalBias = (content: string, sourceName: string): number => {
  // Source-based bias (known media bias ratings)
  const sourceBias = getSourcePoliticalBias(sourceName);
  
  // Content-based bias analysis
  const leftKeywords = [
    'progressive', 'social justice', 'climate change', 'inequality', 'diversity', 'inclusion', 
    'environmental', 'renewable', 'sustainable', 'universal healthcare', 'minimum wage',
    'gun control', 'reproductive rights', 'immigration reform', 'wealth tax', 'medicare for all',
    'green new deal', 'systemic racism', 'police reform', 'lgbtq rights', 'affordable housing'
  ];
  
  const rightKeywords = [
    'conservative', 'traditional values', 'free market', 'law and order', 'border security', 
    'fiscal responsibility', 'deregulation', 'second amendment', 'pro-life', 'family values',
    'small government', 'tax cuts', 'military strength', 'national security', 'religious freedom',
    'school choice', 'constitutional rights', 'individual liberty', 'free enterprise', 'patriotism'
  ];
  
  const contentLower = content.toLowerCase();
  
  let leftScore = 0;
  let rightScore = 0;
  
  leftKeywords.forEach(keyword => {
    const matches = contentLower.match(new RegExp(`\\b${keyword}\\b`, 'g')) || [];
    leftScore += matches.length;
  });
  
  rightKeywords.forEach(keyword => {
    const matches = contentLower.match(new RegExp(`\\b${keyword}\\b`, 'g')) || [];
    rightScore += matches.length;
  });
  
  const totalKeywords = leftScore + rightScore;
  if (totalKeywords === 0) return sourceBias;
  
  const contentBias = ((rightScore - leftScore) / totalKeywords) * 3; // Scale to -3 to 3
  
  // Combine source bias (weight: 0.7) with content bias (weight: 0.3)
  return (sourceBias * 0.7) + (contentBias * 0.3);
};

// Enhanced factuality calculation
export const calculateFactuality = (sourceName: string, content: string): number => {
  // Base factuality on source reputation
  const sourceFactuality: Record<string, number> = {
    'reuters': 9.2, 'associated press': 9.1, 'bbc': 8.8, 'npr': 8.9,
    'wall street journal': 8.7, 'new york times': 8.1, 'washington post': 8.2,
    'cnn': 7.4, 'fox news': 6.8, 'guardian': 8.3, 'financial times': 8.6,
    'abc news': 8.0, 'cbs news': 7.8, 'nbc news': 7.6, 'usa today': 7.2,
    'politico': 7.5, 'axios': 7.8, 'bloomberg': 8.4, 'economist': 8.5
  };

  const normalizedName = sourceName.toLowerCase();
  let baseScore = 6.5; // Default score for unknown sources
  
  for (const [source, score] of Object.entries(sourceFactuality)) {
    if (normalizedName.includes(source) || source.includes(normalizedName)) {
      baseScore = score;
      break;
    }
  }

  // Content quality indicators
  const qualityIndicators = {
    sourceCitations: /according to|sources say|reported by|officials said|spokesperson|statement from|data shows|study finds|research indicates/gi,
    directQuotes: /"[^"]{10,}"/g,
    statistics: /\d+(\.\d+)?%|\d+\s*(million|billion|thousand|percent)/g,
    dateReferences: /yesterday|today|this week|last month|january|february|march|april|may|june|july|august|september|october|november|december|\d{4}|\d{1,2}\/\d{1,2}\/\d{2,4}/gi,
    expertSources: /professor|doctor|researcher|analyst|expert|specialist|director|chief|president|ceo/gi,
    factualLanguage: /data|evidence|research|study|analysis|investigation|report|survey|poll/gi
  };

  let qualityScore = 0;
  const contentLength = content.length;
  
  Object.entries(qualityIndicators).forEach(([indicator, regex]) => {
    const matches = content.match(regex) || [];
    const density = matches.length / (contentLength / 1000); // Per 1000 characters
    
    switch (indicator) {
      case 'sourceCitations':
        qualityScore += Math.min(density * 0.5, 1.0);
        break;
      case 'directQuotes':
        qualityScore += Math.min(density * 0.3, 0.8);
        break;
      case 'statistics':
        qualityScore += Math.min(density * 0.4, 0.6);
        break;
      case 'dateReferences':
        qualityScore += Math.min(density * 0.2, 0.4);
        break;
      case 'expertSources':
        qualityScore += Math.min(density * 0.3, 0.5);
        break;
      case 'factualLanguage':
        qualityScore += Math.min(density * 0.2, 0.3);
        break;
    }
  });
  
  // Penalty for opinion language
  const opinionIndicators = /i think|i believe|in my opinion|it seems|arguably|presumably|supposedly/gi;
  const opinionMatches = content.match(opinionIndicators) || [];
  const opinionPenalty = Math.min((opinionMatches.length / (contentLength / 1000)) * 0.5, 1.0);
  
  const finalScore = Math.max(1, Math.min(10, baseScore + qualityScore - opinionPenalty));
  return Math.round(finalScore * 10) / 10; // Round to 1 decimal place
};

// Helper function for source political bias
const getSourcePoliticalBias = (sourceName: string): number => {
  const biasMap: Record<string, number> = {
    // Left-leaning sources
    'huffpost': -3, 'msnbc': -3, 'cnn': -2, 'new york times': -1.5, 'washington post': -1.5,
    'guardian': -2, 'npr': -1, 'bbc': -0.5, 'abc news': -0.5, 'cbs news': -0.5,
    'nbc news': -0.5, 'politico': -0.5, 'vox': -2.5, 'slate': -2.5, 'salon': -3,
    
    // Center sources
    'reuters': 0, 'associated press': 0, 'bloomberg': 0, 'axios': 0, 'usa today': 0,
    'economist': 0.5, 'financial times': 0.5,
    
    // Right-leaning sources
    'wall street journal': 1, 'fox news': 3, 'breitbart': 4, 'daily wire': 3,
    'new york post': 2, 'washington times': 2.5, 'national review': 3,
    'daily caller': 3.5, 'townhall': 3.5, 'federalist': 3
  };

  const normalizedName = sourceName.toLowerCase();
  for (const [source, bias] of Object.entries(biasMap)) {
    if (normalizedName.includes(source) || source.includes(normalizedName)) {
      return bias;
    }
  }
  return 0; // Default to center if unknown
};

// Main enhanced bias analysis function
export const analyzeArticleBias = async (content: string, sourceName: string): Promise<BiasAnalysis> => {
  try {
    console.log('Starting bias analysis for:', sourceName);
    
    // Run all analyses
    const [sentimentResult, emotionalScore] = await Promise.all([
      analyzeSentiment(content),
      analyzeEmotionalLanguage(content)
    ]);

    // Detect bias keywords and highlights
    const highlights = detectBiasKeywords(content);

    // Calculate political bias
    const politicalBias = detectPoliticalBias(content, sourceName);

    // Calculate factuality
    const factuality = calculateFactuality(sourceName, content);

    console.log('Analysis results:', {
      politicalBias,
      emotionalScore,
      factuality,
      sentiment: sentimentResult.sentiment,
      highlightsCount: highlights.length
    });

    return {
      politicalBias: Math.round(politicalBias * 10) / 10, // Round to 1 decimal
      emotionalLanguage: Math.round(emotionalScore * 10) / 10,
      factuality,
      sentiment: sentimentResult.sentiment as 'positive' | 'negative' | 'neutral',
      highlights: highlights.map(h => ({
        ...h,
        type: h.type as 'emotional' | 'bias' | 'factual'
      }))
    };
  } catch (error) {
    console.error('Error analyzing article bias:', error);
    // Return default values instead of throwing
    return {
      politicalBias: 0,
      emotionalLanguage: 0,
      factuality: 5,
      sentiment: 'neutral',
      highlights: []
    };
  }
};