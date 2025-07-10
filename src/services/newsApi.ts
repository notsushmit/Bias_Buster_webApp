import axios from 'axios';

// Get API keys from localStorage
const getApiKeys = () => ({
  NEWS_API_KEY: localStorage.getItem('newsApiKey') || '31e6e924e5ff4d848aba695ef03b9fc4',
  GNEWS_API_KEY: localStorage.getItem('gnewsApiKey') || '156b6e0dfb628ef49546571f45174081'
});

export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: {
    id: string;
    name: string;
  };
  content: string;
}

export interface BiasRating {
  source: string;
  bias: string;
  factuality: number;
  country: string;
  mediaType: string;
}

// Real NewsAPI integration for fetching related articles
export const fetchRelatedArticles = async (title: string): Promise<NewsArticle[]> => {
  try {
    const { NEWS_API_KEY, GNEWS_API_KEY } = getApiKeys();
    
    // Extract key terms from title for better search
    const searchTerms = extractKeyTerms(title);
    console.log('Searching for related articles with terms:', searchTerms);

    // Try NewsAPI first
    if (NEWS_API_KEY && NEWS_API_KEY !== 'your_api_key_here') {
      try {
        const response = await axios.get('https://newsapi.org/v2/everything', {
          params: {
            q: searchTerms,
            apiKey: NEWS_API_KEY,
            pageSize: 10,
            sortBy: 'publishedAt',
            language: 'en',
            domains: 'reuters.com,bbc.com,cnn.com,foxnews.com,nytimes.com,washingtonpost.com,theguardian.com,wsj.com,npr.org,apnews.com'
          },
          timeout: 10000
        });

        if (response.data.status === 'ok' && response.data.articles.length > 0) {
          console.log(`Found ${response.data.articles.length} related articles from NewsAPI`);
          return response.data.articles
            .filter((article: any) => 
              article.title && 
              article.description && 
              article.url &&
              !article.title.includes('[Removed]') &&
              article.title.toLowerCase() !== title.toLowerCase()
            )
            .slice(0, 6);
        }
      } catch (newsApiError) {
        console.log('NewsAPI failed, trying GNews:', newsApiError.message);
      }
    }

    // Try GNews as fallback
    if (GNEWS_API_KEY && GNEWS_API_KEY !== 'your_api_key_here') {
      try {
        const response = await axios.get('https://gnews.io/api/v4/search', {
          params: {
            q: searchTerms,
            token: GNEWS_API_KEY,
            lang: 'en',
            max: 10,
            sortby: 'publishedAt'
          },
          timeout: 10000
        });

        if (response.data.articles && response.data.articles.length > 0) {
          console.log(`Found ${response.data.articles.length} related articles from GNews`);
          return response.data.articles
            .filter((article: any) => 
              article.title && 
              article.description && 
              article.url &&
              article.title.toLowerCase() !== title.toLowerCase()
            )
            .map((article: any) => ({
              ...article,
              source: { id: '', name: article.source.name || 'Unknown' }
            }))
            .slice(0, 6);
        }
      } catch (gnewsError) {
        console.log('GNews also failed:', gnewsError.message);
      }
    }

    // If both APIs fail, return empty array (no mock data)
    console.log('Both news APIs failed or no API keys available');
    return [];

  } catch (error) {
    console.error('Error fetching related articles:', error);
    return [];
  }
};

// Extract key terms from title for better search
const extractKeyTerms = (title: string): string => {
  // Remove common stop words and extract meaningful terms
  const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should'];
  
  const words = title.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3 && !stopWords.includes(word));
  
  // Take the most important words (first 3-4)
  return words.slice(0, 4).join(' ');
};

// Real media bias database based on research from AllSides, Media Bias/Fact Check, and academic sources
export const mediaBiasDatabase: Record<string, BiasRating> = {
  // Wire Services & International (Most Reliable)
  'reuters': { source: 'Reuters', bias: 'center', factuality: 9.2, country: 'UK', mediaType: 'Wire Service' },
  'associated press': { source: 'Associated Press', bias: 'center', factuality: 9.1, country: 'US', mediaType: 'Wire Service' },
  'bbc': { source: 'BBC News', bias: 'center-left', factuality: 8.8, country: 'UK', mediaType: 'Public Broadcasting' },
  
  // US Cable News
  'cnn': { source: 'CNN', bias: 'center-left', factuality: 7.4, country: 'US', mediaType: 'Cable News' },
  'fox news': { source: 'Fox News', bias: 'right', factuality: 6.8, country: 'US', mediaType: 'Cable News' },
  'msnbc': { source: 'MSNBC', bias: 'left', factuality: 7.2, country: 'US', mediaType: 'Cable News' },
  
  // US Newspapers
  'new york times': { source: 'New York Times', bias: 'center-left', factuality: 8.1, country: 'US', mediaType: 'Newspaper' },
  'washington post': { source: 'Washington Post', bias: 'center-left', factuality: 8.2, country: 'US', mediaType: 'Newspaper' },
  'wall street journal': { source: 'Wall Street Journal', bias: 'center-right', factuality: 8.7, country: 'US', mediaType: 'Newspaper' },
  'usa today': { source: 'USA Today', bias: 'center', factuality: 7.2, country: 'US', mediaType: 'Newspaper' },
  'new york post': { source: 'New York Post', bias: 'right', factuality: 6.5, country: 'US', mediaType: 'Newspaper' },
  
  // US Broadcast News
  'npr': { source: 'NPR', bias: 'center-left', factuality: 8.9, country: 'US', mediaType: 'Public Radio' },
  'abc news': { source: 'ABC News', bias: 'center-left', factuality: 8.0, country: 'US', mediaType: 'Broadcast News' },
  'cbs news': { source: 'CBS News', bias: 'center-left', factuality: 7.8, country: 'US', mediaType: 'Broadcast News' },
  'nbc news': { source: 'NBC News', bias: 'center-left', factuality: 7.6, country: 'US', mediaType: 'Broadcast News' },
  
  // International
  'guardian': { source: 'The Guardian', bias: 'center-left', factuality: 8.3, country: 'UK', mediaType: 'Newspaper' },
  'financial times': { source: 'Financial Times', bias: 'center-right', factuality: 8.6, country: 'UK', mediaType: 'Newspaper' },
  'economist': { source: 'The Economist', bias: 'center', factuality: 8.5, country: 'UK', mediaType: 'Magazine' },
  
  // Digital/Online
  'politico': { source: 'Politico', bias: 'center-left', factuality: 7.5, country: 'US', mediaType: 'Digital News' },
  'axios': { source: 'Axios', bias: 'center', factuality: 7.8, country: 'US', mediaType: 'Digital News' },
  'bloomberg': { source: 'Bloomberg', bias: 'center', factuality: 8.4, country: 'US', mediaType: 'Financial News' },
  'huffpost': { source: 'HuffPost', bias: 'left', factuality: 6.9, country: 'US', mediaType: 'Digital News' },
  'breitbart': { source: 'Breitbart', bias: 'right', factuality: 5.8, country: 'US', mediaType: 'Digital News' },
  'daily wire': { source: 'Daily Wire', bias: 'right', factuality: 6.2, country: 'US', mediaType: 'Digital News' },
  'vox': { source: 'Vox', bias: 'left', factuality: 7.1, country: 'US', mediaType: 'Digital News' }
};

export const getSourceBiasRating = (sourceName: string): BiasRating | null => {
  const normalizedName = sourceName.toLowerCase()
    .replace(/^(the\s+)?/, '') // Remove "the" prefix
    .replace(/\s+(news|media|network|times|post|journal|herald|tribune)$/, '') // Remove common suffixes
    .trim();
  
  // Direct match first
  if (mediaBiasDatabase[normalizedName]) {
    return mediaBiasDatabase[normalizedName];
  }
  
  // Partial match
  for (const [key, rating] of Object.entries(mediaBiasDatabase)) {
    if (normalizedName.includes(key) || key.includes(normalizedName)) {
      return rating;
    }
  }
  
  // Domain-based matching
  try {
    const domain = sourceName.toLowerCase()
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .split('/')[0]
      .split('.')[0];
    
    for (const [key, rating] of Object.entries(mediaBiasDatabase)) {
      if (key.includes(domain) || domain.includes(key.split(' ')[0])) {
        return rating;
      }
    }
  } catch (error) {
    // Ignore domain parsing errors
  }
  
  return null;
};