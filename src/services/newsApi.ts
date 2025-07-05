import axios from 'axios';

// Get API keys from localStorage instead of environment variables
const getApiKeys = () => ({
  NEWS_API_KEY: localStorage.getItem('newsApiKey') || '',
  GNEWS_API_KEY: localStorage.getItem('gnewsApiKey') || ''
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

// NewsAPI.org integration
export const fetchArticlesByKeyword = async (keyword: string, pageSize: number = 10): Promise<NewsArticle[]> => {
  try {
    const { NEWS_API_KEY } = getApiKeys();
    
    if (!NEWS_API_KEY) {
      console.warn('News API key not found in localStorage');
      return [];
    }

    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: keyword,
        apiKey: NEWS_API_KEY,
        pageSize,
        sortBy: 'publishedAt',
        language: 'en'
      }
    });
    return response.data.articles;
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
};

// GNews API integration
export const fetchRelatedArticles = async (title: string): Promise<NewsArticle[]> => {
  try {
    const { GNEWS_API_KEY } = getApiKeys();
    
    if (!GNEWS_API_KEY) {
      console.warn('GNews API key not found in localStorage');
      return [];
    }

    const response = await axios.get('https://gnews.io/api/v4/search', {
      params: {
        q: title,
        token: GNEWS_API_KEY,
        lang: 'en',
        max: 10
      }
    });
    return response.data.articles;
  } catch (error) {
    console.error('Error fetching related articles:', error);
    return [];
  }
};

// Extract article content from URL
export const extractArticleContent = async (url: string): Promise<string> => {
  try {
    // Using a CORS proxy for article extraction
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
    const response = await axios.get(proxyUrl);
    
    // Basic content extraction (in production, use a proper article extraction service)
    const parser = new DOMParser();
    const doc = parser.parseFromString(response.data.contents, 'text/html');
    
    // Remove scripts and styles
    const scripts = doc.querySelectorAll('script, style');
    scripts.forEach(el => el.remove());
    
    // Extract main content (this is a simplified approach)
    const content = doc.querySelector('article, .article-content, .post-content, main')?.textContent || 
                   doc.body?.textContent || '';
    
    return content.trim();
  } catch (error) {
    console.error('Error extracting article content:', error);
    return '';
  }
};

// Media Bias/Fact Check database (static data since no public API)
export const mediaBiasDatabase: Record<string, BiasRating> = {
  'reuters': { source: 'Reuters', bias: 'center', factuality: 9.2, country: 'UK', mediaType: 'Wire Service' },
  'bbc': { source: 'BBC News', bias: 'center-left', factuality: 8.8, country: 'UK', mediaType: 'Public Broadcasting' },
  'cnn': { source: 'CNN', bias: 'center-left', factuality: 7.4, country: 'US', mediaType: 'Cable News' },
  'fox news': { source: 'Fox News', bias: 'right', factuality: 6.8, country: 'US', mediaType: 'Cable News' },
  'npr': { source: 'NPR', bias: 'center-left', factuality: 8.9, country: 'US', mediaType: 'Public Radio' },
  'wall street journal': { source: 'Wall Street Journal', bias: 'center-right', factuality: 8.7, country: 'US', mediaType: 'Newspaper' },
  'new york times': { source: 'New York Times', bias: 'center-left', factuality: 8.1, country: 'US', mediaType: 'Newspaper' },
  'washington post': { source: 'Washington Post', bias: 'center-left', factuality: 8.2, country: 'US', mediaType: 'Newspaper' },
  'associated press': { source: 'Associated Press', bias: 'center', factuality: 9.1, country: 'US', mediaType: 'Wire Service' },
  'guardian': { source: 'The Guardian', bias: 'center-left', factuality: 8.3, country: 'UK', mediaType: 'Newspaper' }
};

export const getSourceBiasRating = (sourceName: string): BiasRating | null => {
  const normalizedName = sourceName.toLowerCase();
  for (const [key, rating] of Object.entries(mediaBiasDatabase)) {
    if (normalizedName.includes(key) || key.includes(normalizedName)) {
      return rating;
    }
  }
  return null;
};