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

// Enhanced sentiment analysis using actual content
export const analyzeSentiment = (text: string): { sentiment: string; confidence: number; score: number } => {
  const positiveWords = [
    'good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'positive', 'success', 
    'achievement', 'progress', 'improvement', 'beneficial', 'effective', 'outstanding', 
    'remarkable', 'brilliant', 'superb', 'magnificent', 'exceptional', 'impressive',
    'breakthrough', 'victory', 'triumph', 'prosperity', 'flourishing', 'thriving',
    'celebrate', 'win', 'accomplish', 'advance', 'boost', 'enhance', 'upgrade',
    'approve', 'support', 'endorse', 'praise', 'commend', 'applaud', 'welcome'
  ];
  
  const negativeWords = [
    'bad', 'terrible', 'awful', 'horrible', 'disgusting', 'outrageous', 'negative', 'failure', 
    'crisis', 'disaster', 'problem', 'issue', 'concern', 'disappointing', 'devastating',
    'catastrophic', 'tragic', 'alarming', 'disturbing', 'shocking', 'appalling',
    'scandal', 'corruption', 'fraud', 'violence', 'conflict', 'war', 'death',
    'decline', 'collapse', 'crash', 'plummet', 'suffer', 'struggle', 'threat',
    'condemn', 'criticize', 'oppose', 'reject', 'deny', 'refuse', 'attack'
  ];

  const intensifiers = ['very', 'extremely', 'incredibly', 'absolutely', 'completely', 'totally', 'utterly', 'highly', 'deeply'];
  
  const words = text.toLowerCase().split(/\s+/);
  let positiveScore = 0;
  let negativeScore = 0;
  
  for (let i = 0; i < words.length; i++) {
    const word = words[i].replace(/[^\w]/g, '');
    let multiplier = 1;
    
    // Check for intensifiers
    if (i > 0 && intensifiers.includes(words[i - 1])) {
      multiplier = 1.8;
    }
    
    if (positiveWords.some(pw => word.includes(pw) || pw.includes(word))) {
      positiveScore += multiplier;
    }
    if (negativeWords.some(nw => word.includes(nw) || nw.includes(word))) {
      negativeScore += multiplier;
    }
  }
  
  const totalSentimentWords = positiveScore + negativeScore;
  if (totalSentimentWords === 0) {
    return { sentiment: 'neutral', confidence: 0.5, score: 0 };
  }
  
  const positiveRatio = positiveScore / totalSentimentWords;
  const sentimentStrength = totalSentimentWords / Math.max(words.length / 100, 1);
  const confidence = Math.min(sentimentStrength, 1);
  
  let sentiment: string;
  let score: number;
  
  if (positiveRatio > 0.65) {
    sentiment = 'positive';
    score = (positiveRatio - 0.5) * 10; // Scale to 0-5
  } else if (positiveRatio < 0.35) {
    sentiment = 'negative';
    score = -(0.5 - positiveRatio) * 10; // Scale to -5-0
  } else {
    sentiment = 'neutral';
    score = 0;
  }
  
  return { sentiment, confidence, score };
};

// Real emotional language detection based on actual content
export const analyzeEmotionalLanguage = (text: string): number => {
  const emotionalWords = {
    extreme: ['outrageous', 'shocking', 'devastating', 'catastrophic', 'unprecedented', 'explosive', 
              'bombshell', 'scandalous', 'horrific', 'terrifying', 'incredible', 'unbelievable',
              'mind-blowing', 'earth-shattering', 'jaw-dropping', 'breathtaking', 'sensational',
              'dramatic', 'stunning', 'astounding', 'phenomenal', 'extraordinary', 'miraculous'],
    high: ['concerning', 'troubling', 'worrying', 'surprising', 'remarkable', 'notable',
           'significant', 'important', 'serious', 'major', 'critical', 'urgent', 'alarming',
           'disturbing', 'amazing', 'fantastic', 'wonderful', 'terrible', 'awful', 'brilliant'],
    medium: ['interesting', 'notable', 'relevant', 'related', 'connected', 'associated',
             'considerable', 'substantial', 'meaningful', 'noteworthy', 'impressive', 'concerning'],
    low: ['some', 'certain', 'particular', 'specific', 'general', 'basic', 'simple', 'minor']
  };

  // Detect formatting patterns that indicate emotional language
  const capsPattern = /\b[A-Z]{3,}\b/g; // Words in ALL CAPS
  const exclamationPattern = /!{1,}/g; // Exclamation marks
  const questionPattern = /\?{2,}/g; // Multiple question marks
  const quotesPattern = /"[^"]*"/g; // Quoted text (often emotional)
  
  const words = text.toLowerCase().split(/\s+/);
  let emotionalScore = 0;
  let totalWords = words.length;
  
  // Score based on emotional words with different weights
  words.forEach(word => {
    const cleanWord = word.replace(/[^\w]/g, '');
    if (emotionalWords.extreme.some(ew => cleanWord.includes(ew) || ew.includes(cleanWord))) {
      emotionalScore += 4;
    } else if (emotionalWords.high.some(ew => cleanWord.includes(ew) || ew.includes(cleanWord))) {
      emotionalScore += 3;
    } else if (emotionalWords.medium.some(ew => cleanWord.includes(ew) || ew.includes(cleanWord))) {
      emotionalScore += 2;
    } else if (emotionalWords.low.some(ew => cleanWord.includes(ew) || ew.includes(cleanWord))) {
      emotionalScore += 1;
    }
  });
  
  // Score based on formatting patterns
  const capsMatches = text.match(capsPattern) || [];
  const exclamationMatches = text.match(exclamationPattern) || [];
  const questionMatches = text.match(questionPattern) || [];
  const quotesMatches = text.match(quotesPattern) || [];
  
  emotionalScore += capsMatches.length * 3;
  emotionalScore += exclamationMatches.length * 2;
  emotionalScore += questionMatches.length * 1.5;
  emotionalScore += quotesMatches.length * 1;
  
  // Check for emotional punctuation patterns
  if (text.includes('...')) emotionalScore += 1;
  if (text.includes('--')) emotionalScore += 0.5;
  
  // Normalize to 0-10 scale based on content length
  const normalizedScore = Math.min((emotionalScore / Math.max(totalWords / 50, 1)) * 2, 10);
  
  return Math.round(normalizedScore * 10) / 10;
};

// Real bias detection with actual keyword analysis
export const detectBiasKeywords = (text: string): Array<{ text: string; type: string; explanation: string; startIndex: number; endIndex: number }> => {
  const biasPatterns = {
    emotional: [
      { pattern: /\b(devastating|catastrophic|shocking|outrageous|unprecedented)\b/gi, explanation: 'Emotionally charged language that may exaggerate impact' },
      { pattern: /\b(explosive|bombshell|stunning|mind-blowing|earth-shattering)\b/gi, explanation: 'Sensationalized language designed to provoke reaction' },
      { pattern: /\b(miraculous|incredible|unbelievable|phenomenal|extraordinary)\b/gi, explanation: 'Hyperbolic language that may overstate significance' },
      { pattern: /\b(horrific|terrifying|appalling|disgusting|revolting)\b/gi, explanation: 'Extreme emotional descriptors that may bias perception' }
    ],
    leftBias: [
      { pattern: /\b(progressive|social justice|climate crisis|systemic racism|wealth inequality)\b/gi, explanation: 'Language commonly associated with left-leaning perspectives' },
      { pattern: /\b(corporate greed|tax the rich|medicare for all|green new deal|reproductive rights)\b/gi, explanation: 'Terminology often used in progressive political discourse' },
      { pattern: /\b(fascist|authoritarian|far-right|extremist|white supremacist)\b/gi, explanation: 'Strong negative characterizations often used by left-leaning sources' },
      { pattern: /\b(universal healthcare|living wage|workers rights|union organizing|collective bargaining)\b/gi, explanation: 'Progressive policy terminology' }
    ],
    rightBias: [
      { pattern: /\b(traditional values|law and order|border security|fiscal responsibility|free market)\b/gi, explanation: 'Language commonly associated with right-leaning perspectives' },
      { pattern: /\b(socialist|communist|radical left|liberal elite|mainstream media)\b/gi, explanation: 'Terminology often used in conservative political discourse' },
      { pattern: /\b(deep state|fake news|cancel culture|woke agenda|virtue signaling)\b/gi, explanation: 'Phrases commonly used to dismiss opposing viewpoints' },
      { pattern: /\b(second amendment|pro-life|family values|religious freedom|states rights)\b/gi, explanation: 'Conservative policy terminology' }
    ],
    factual: [
      { pattern: /\b(according to|sources say|data shows|study finds|research indicates)\b/gi, explanation: 'Proper source attribution - sign of factual reporting' },
      { pattern: /\b(allegedly|reportedly|appears to|seems to|may have)\b/gi, explanation: 'Cautious language indicating unverified claims - good journalism' },
      { pattern: /\b(confirmed|verified|documented|established|proven)\b/gi, explanation: 'Language indicating fact-checking and verification' }
    ]
  };

  const highlights: Array<{ text: string; type: string; explanation: string; startIndex: number; endIndex: number }> = [];
  
  Object.entries(biasPatterns).forEach(([category, patterns]) => {
    patterns.forEach(({ pattern, explanation }) => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const type = category === 'leftBias' || category === 'rightBias' ? 'bias' : 
                    category === 'emotional' ? 'emotional' : 'factual';
        
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

// Real political bias detection based on content analysis
export const detectPoliticalBias = (content: string, sourceName: string): number => {
  const leftKeywords = [
    'progressive', 'social justice', 'climate change', 'climate crisis', 'inequality', 'diversity', 'inclusion', 
    'environmental', 'renewable', 'sustainable', 'universal healthcare', 'minimum wage', 'living wage',
    'gun control', 'reproductive rights', 'immigration reform', 'wealth tax', 'medicare for all',
    'green new deal', 'systemic racism', 'police reform', 'lgbtq rights', 'affordable housing',
    'workers rights', 'union', 'collective bargaining', 'public option', 'student debt relief',
    'corporate accountability', 'tax the wealthy', 'social programs', 'public education funding'
  ];
  
  const rightKeywords = [
    'conservative', 'traditional values', 'free market', 'law and order', 'border security', 
    'fiscal responsibility', 'deregulation', 'second amendment', 'pro-life', 'family values',
    'small government', 'tax cuts', 'military strength', 'national security', 'religious freedom',
    'school choice', 'constitutional rights', 'individual liberty', 'free enterprise', 'patriotism',
    'states rights', 'personal responsibility', 'limited government', 'free speech', 'capitalism',
    'business friendly', 'job creators', 'economic growth', 'defense spending'
  ];

  const leftNegativeFraming = [
    'corporate greed', 'tax breaks for the wealthy', 'climate denial', 'voter suppression',
    'authoritarian', 'fascist', 'far-right', 'extremist', 'white supremacist', 'racist',
    'bigoted', 'discriminatory', 'oppressive', 'regressive'
  ];

  const rightNegativeFraming = [
    'socialist', 'communist', 'radical left', 'liberal elite', 'mainstream media',
    'deep state', 'fake news', 'cancel culture', 'woke agenda', 'virtue signaling',
    'anti-american', 'unpatriotic', 'godless', 'immoral'
  ];
  
  const contentLower = content.toLowerCase();
  
  let leftScore = 0;
  let rightScore = 0;
  
  // Count positive framing keywords
  leftKeywords.forEach(keyword => {
    const regex = new RegExp(`\\b${keyword.replace(/\s+/g, '\\s+')}\\b`, 'g');
    const matches = contentLower.match(regex) || [];
    leftScore += matches.length;
  });
  
  rightKeywords.forEach(keyword => {
    const regex = new RegExp(`\\b${keyword.replace(/\s+/g, '\\s+')}\\b`, 'g');
    const matches = contentLower.match(regex) || [];
    rightScore += matches.length;
  });

  // Count negative framing (adds to opposite side)
  leftNegativeFraming.forEach(phrase => {
    const regex = new RegExp(`\\b${phrase.replace(/\s+/g, '\\s+')}\\b`, 'g');
    const matches = contentLower.match(regex) || [];
    leftScore += matches.length * 1.5; // Weight negative framing more heavily
  });

  rightNegativeFraming.forEach(phrase => {
    const regex = new RegExp(`\\b${phrase.replace(/\s+/g, '\\s+')}\\b`, 'g');
    const matches = contentLower.match(regex) || [];
    rightScore += matches.length * 1.5;
  });
  
  // Get source bias as baseline
  const sourceBias = getSourcePoliticalBias(sourceName);
  
  const totalKeywords = leftScore + rightScore;
  if (totalKeywords === 0) {
    return sourceBias; // Return source bias if no content indicators
  }
  
  // Calculate content bias (-5 to +5 scale)
  const contentBias = ((rightScore - leftScore) / totalKeywords) * 5;
  
  // Combine source bias (30%) with content bias (70%) for more content-driven analysis
  const finalBias = (sourceBias * 0.3) + (contentBias * 0.7);
  
  return Math.max(-5, Math.min(5, finalBias));
};

// Real factuality calculation based on content quality indicators
export const calculateFactuality = (sourceName: string, content: string): number => {
  // Base factuality on source reputation (known reliable sources)
  const sourceFactuality: Record<string, number> = {
    'reuters': 9.2, 'associated press': 9.1, 'bbc': 8.8, 'npr': 8.9,
    'wall street journal': 8.7, 'new york times': 8.1, 'washington post': 8.2,
    'cnn': 7.4, 'fox news': 6.8, 'guardian': 8.3, 'financial times': 8.6,
    'abc news': 8.0, 'cbs news': 7.8, 'nbc news': 7.6, 'usa today': 7.2,
    'politico': 7.5, 'axios': 7.8, 'bloomberg': 8.4, 'economist': 8.5,
    'breitbart': 5.5, 'huffpost': 6.9, 'daily wire': 6.0, 'vox': 7.0
  };

  const normalizedName = sourceName.toLowerCase();
  let baseScore = 6.0; // Default score for unknown sources
  
  for (const [source, score] of Object.entries(sourceFactuality)) {
    if (normalizedName.includes(source) || source.includes(normalizedName)) {
      baseScore = score;
      break;
    }
  }

  // Analyze content quality indicators
  const contentLength = content.length;
  let qualityScore = 0;

  // Positive indicators (signs of good journalism)
  const sourceCitations = content.match(/according to|sources say|reported by|officials said|spokesperson|statement from|data shows|study finds|research indicates/gi) || [];
  const directQuotes = content.match(/"[^"]{20,}"/g) || [];
  const statistics = content.match(/\d+(\.\d+)?%|\d+\s*(million|billion|thousand|percent)/g) || [];
  const dateReferences = content.match(/yesterday|today|this week|last month|january|february|march|april|may|june|july|august|september|october|november|december|\d{4}|\d{1,2}\/\d{1,2}\/\d{2,4}/gi) || [];
  const expertSources = content.match(/professor|doctor|researcher|analyst|expert|specialist|director|chief|president|ceo/gi) || [];
  const factualLanguage = content.match(/data|evidence|research|study|analysis|investigation|report|survey|poll/gi) || [];
  const verificationLanguage = content.match(/confirmed|verified|documented|established|proven|fact-checked/gi) || [];

  // Calculate quality indicators (per 1000 characters for normalization)
  const density = 1000 / Math.max(contentLength, 1000);
  qualityScore += Math.min(sourceCitations.length * density * 0.5, 1.5);
  qualityScore += Math.min(directQuotes.length * density * 0.3, 1.0);
  qualityScore += Math.min(statistics.length * density * 0.4, 1.0);
  qualityScore += Math.min(dateReferences.length * density * 0.2, 0.5);
  qualityScore += Math.min(expertSources.length * density * 0.3, 0.8);
  qualityScore += Math.min(factualLanguage.length * density * 0.2, 0.5);
  qualityScore += Math.min(verificationLanguage.length * density * 0.4, 0.8);

  // Negative indicators (signs of poor journalism)
  const opinionLanguage = content.match(/i think|i believe|in my opinion|it seems|arguably|presumably|supposedly|clearly|obviously/gi) || [];
  const sensationalLanguage = content.match(/shocking|outrageous|unbelievable|incredible|devastating|explosive|bombshell/gi) || [];
  const unsourcedClaims = content.match(/many people say|it is said|rumors suggest|sources claim|allegedly without attribution/gi) || [];
  const clickbaitLanguage = content.match(/you won't believe|this will shock you|amazing|incredible|must see/gi) || [];

  const opinionPenalty = Math.min(opinionLanguage.length * density * 0.3, 1.0);
  const sensationalPenalty = Math.min(sensationalLanguage.length * density * 0.4, 1.5);
  const unsourcedPenalty = Math.min(unsourcedClaims.length * density * 0.5, 1.2);
  const clickbaitPenalty = Math.min(clickbaitLanguage.length * density * 0.3, 0.8);

  // Calculate final score
  const finalScore = baseScore + qualityScore - opinionPenalty - sensationalPenalty - unsourcedPenalty - clickbaitPenalty;
  
  return Math.max(1, Math.min(10, Math.round(finalScore * 10) / 10));
};

// Helper function for source political bias (based on media bias research)
const getSourcePoliticalBias = (sourceName: string): number => {
  const biasMap: Record<string, number> = {
    // Left-leaning sources
    'huffpost': -3.5, 'msnbc': -3.2, 'vox': -2.8, 'slate': -2.5, 'salon': -3.0,
    'cnn': -2.0, 'new york times': -1.8, 'washington post': -1.6, 'guardian': -2.2,
    'npr': -1.2, 'bbc': -0.8, 'abc news': -0.6, 'cbs news': -0.5, 'nbc news': -0.7,
    'politico': -0.8, 'mother jones': -3.5, 'the nation': -3.2,
    
    // Center sources
    'reuters': 0, 'associated press': 0, 'bloomberg': 0.2, 'axios': -0.2, 'usa today': 0.1,
    'economist': 0.3, 'financial times': 0.4, 'christian science monitor': 0,
    
    // Right-leaning sources
    'wall street journal': 1.2, 'fox news': 3.5, 'breitbart': 4.2, 'daily wire': 3.8,
    'new york post': 2.2, 'washington times': 2.8, 'national review': 3.2,
    'daily caller': 3.6, 'townhall': 3.8, 'federalist': 3.4, 'newsmax': 4.0,
    'oan': 4.5, 'gateway pundit': 4.8
  };

  const normalizedName = sourceName.toLowerCase();
  for (const [source, bias] of Object.entries(biasMap)) {
    if (normalizedName.includes(source) || source.includes(normalizedName)) {
      return bias;
    }
  }
  return 0; // Default to center if unknown
};

// Main analysis function with real-time content analysis
export const analyzeArticleBias = async (content: string, sourceName: string): Promise<BiasAnalysis> => {
  try {
    console.log('Starting real-time bias analysis for:', sourceName);
    console.log('Content length:', content.length);
    
    if (!content || content.length < 100) {
      throw new Error('Insufficient content for analysis');
    }
    
    // Run real-time analyses on actual content
    const sentimentResult = analyzeSentiment(content);
    const emotionalScore = analyzeEmotionalLanguage(content);
    const highlights = detectBiasKeywords(content);
    const politicalBias = detectPoliticalBias(content, sourceName);
    const factuality = calculateFactuality(sourceName, content);

    console.log('Real-time analysis results:', {
      politicalBias: Math.round(politicalBias * 10) / 10,
      emotionalScore: Math.round(emotionalScore * 10) / 10,
      factuality,
      sentiment: sentimentResult.sentiment,
      highlightsCount: highlights.length,
      sentimentScore: sentimentResult.score
    });

    return {
      politicalBias: Math.round(politicalBias * 10) / 10,
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
    throw error;
  }
};