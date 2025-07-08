export const en = {
  common: {
    loading: 'Loading...',
    error: 'Error',
    save: 'Save',
    cancel: 'Cancel',
    close: 'Close',
    search: 'Search',
    filter: 'Filter',
    analyze: 'Analyze',
    analyzing: 'Analyzing...',
    analyzeNow: 'Analyze Now',
    viewOriginal: 'View Original Article',
    readMore: 'Read More',
    showLess: 'Show Less',
    noResults: 'No results found',
    tryAgain: 'Try Again',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    settings: 'Settings',
    language: 'Language',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode'
  },
  header: {
    title: 'Bias Buster',
    articleAnalyzer: 'Article Analyzer',
    dashboard: 'Dashboard',
    sourceDirectory: 'Source Directory',
    apiSettings: 'API Settings'
  },
  accessibility: {
    colorblindSupport: 'Colorblind Support',
    themeChanged: 'Theme changed to',
    tip: 'Accessibility Tip',
    tipDescription: 'These themes are designed to improve readability for different types of color vision.',
    themes: {
      default: 'Default',
      defaultDesc: 'Standard color scheme',
      protanopia: 'Protanopia',
      protanopiaDesc: 'Red-blind friendly colors',
      deuteranopia: 'Deuteranopia', 
      deuteranopiaDesc: 'Green-blind friendly colors',
      tritanopia: 'Tritanopia',
      tritanopiaDesc: 'Blue-blind friendly colors',
      monochrome: 'Monochrome',
      monochromeDesc: 'Grayscale for complete color blindness',
      highContrast: 'High Contrast',
      highContrastDesc: 'Maximum contrast for low vision'
    }
  },
  tts: {
    readHeaders: 'Read All Headers',
    pause: 'Pause Reading',
    resume: 'Resume Reading',
    stop: 'Stop Reading',
    settings: 'TTS Settings',
    voice: 'Voice',
    speed: 'Speed',
    volume: 'Volume',
    mute: 'Mute',
    unmute: 'Unmute',
    loading: 'Loading...',
    error: 'Speech synthesis error',
    noHeaders: 'No headers found on this page',
    howItWorks: 'How it works:',
    description: 'Click play to read all headers on the current page using high-quality AI voice synthesis.'
  },
  analyzer: {
    hero: {
      badge: 'AI-Powered Bias Detection',
      title: 'Uncover Hidden',
      subtitle: 'Media Bias',
      description: 'Analyze any news article instantly with our advanced AI to detect political bias, emotional language, and factuality. See how different sources frame the same story.',
      placeholder: 'Paste any news article URL here...',
      examples: 'Try these example articles:'
    },
    analysis: {
      complete: 'Analysis Complete',
      aiResults: 'AI-powered bias detection results',
      source: 'Source',
      author: 'Author',
      published: 'Published',
      politicalBias: 'Political Bias',
      factuality: 'Factuality',
      emotionalLanguage: 'Emotional Language',
      politicalLeaning: 'Political leaning detected in content',
      reliabilityAssessment: 'Factuality assessment (via ClaimBuster API)',
      emotionalIntensity: 'Emotional intensity in language (via Hugging Face AI)'
    },
    bias: {
      left: 'Left',
      centerLeft: 'Center-Left',
      center: 'Center',
      centerRight: 'Center-Right',
      right: 'Right',
      high: 'High',
      medium: 'Medium',
      low: 'Low',
      highlyReliable: 'Highly Reliable',
      moderatelyReliable: 'Moderately Reliable',
      lessReliable: 'Less Reliable'
    },
    coverage: {
      title: 'Comparative Coverage',
      description: 'How different sources frame this story',
      factuality: 'Factuality',
      tone: 'Tone',
      positive: 'positive',
      negative: 'negative',
      neutral: 'neutral',
      noResults: 'No comparative coverage found',
      tryRecent: 'Try analyzing a more recent or popular article'
    },
    highlights: {
      title: 'Content Analysis',
      emotionalLanguage: 'Emotional Language',
      potentialBias: 'Potential Bias'
    },
    social: {
      title: 'Social Media Reactions',
      interactions: 'interactions',
      topComments: 'Top Comments:'
    },
    errors: {
      title: 'Analysis Error',
      extractionFailed: 'Unable to extract article content from the provided URL',
      analysisGeneral: 'An error occurred during analysis'
    }
  },
  dashboard: {
    hero: {
      badge: 'Personal Analytics',
      title: 'Your Reading',
      subtitle: 'Analytics',
      description: 'Track your news consumption patterns, bias exposure, and reading habits over time.'
    },
    stats: {
      articlesAnalyzed: 'Articles Analyzed',
      biasAlerts: 'Bias Alerts',
      sourcesTracked: 'Sources Tracked',
      readingStreak: 'Reading Streak',
      days: 'days'
    },
    charts: {
      biasHistory: 'Bias Exposure History',
      lastDays: 'Last 5 days of reading patterns',
      topSources: 'Top Sources',
      mostRead: 'Most read news sources',
      articles: 'articles'
    },
    bias: {
      left: 'Left',
      center: 'Center',
      right: 'Right'
    }
  },
  sources: {
    title: 'News Source Directory',
    description: 'Explore bias ratings and factuality scores for major news organizations worldwide.',
    search: 'Search news sources...',
    allBias: 'All Bias Types',
    politicalBias: 'Political Bias',
    factuality: 'Factuality',
    category: 'Category',
    verifiedSource: 'Verified Source',
    country: 'Country',
    categories: {
      international: 'International',
      national: 'National',
      business: 'Business',
      technology: 'Technology',
      sports: 'Sports',
      entertainment: 'Entertainment'
    }
  },
  api: {
    title: 'API Configuration',
    configured: 'API Keys Configured!',
    ready: 'Your NewsAPI and GNews keys are already set up and ready to use.',
    newsApiKey: 'NewsAPI Key',
    gnewsApiKey: 'GNews API Key',
    newsApiPlaceholder: 'Get from newsapi.org',
    gnewsPlaceholder: 'Get from gnews.io',
    information: 'API Information:',
    newsApiInfo: '100 requests/day (free tier)',
    gnewsInfo: '100 requests/day (free tier)',
    localStorage: 'API keys are stored locally in your browser',
    updateKeys: 'Update Keys',
    saved: 'Saved!'
  }
};