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

// Enhanced NewsAPI integration with better error handling
export const fetchArticlesByKeyword = async (keyword: string, pageSize: number = 10): Promise<NewsArticle[]> => {
  try {
    const { NEWS_API_KEY } = getApiKeys();
    
    if (!NEWS_API_KEY) {
      console.warn('News API key not found');
      return await fetchFromGNews(keyword, pageSize);
    }

    console.log('Fetching articles from NewsAPI for keyword:', keyword);

    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: keyword,
        apiKey: NEWS_API_KEY,
        pageSize,
        sortBy: 'publishedAt',
        language: 'en',
        domains: 'reuters.com,bbc.com,cnn.com,foxnews.com,nytimes.com,washingtonpost.com,theguardian.com,wsj.com,npr.org,apnews.com'
      },
      timeout: 10000
    });

    if (response.data.status === 'ok') {
      console.log(`Found ${response.data.articles.length} articles from NewsAPI`);
      return response.data.articles.filter((article: any) => 
        article.title && 
        article.description && 
        article.url &&
        !article.title.includes('[Removed]')
      );
    } else {
      throw new Error(response.data.message || 'NewsAPI request failed');
    }
  } catch (error) {
    console.error('NewsAPI error:', error);
    // Fallback to GNews
    return await fetchFromGNews(keyword, pageSize);
  }
};

// Enhanced GNews API integration
export const fetchRelatedArticles = async (title: string): Promise<NewsArticle[]> => {
  try {
    const { GNEWS_API_KEY } = getApiKeys();
    
    if (!GNEWS_API_KEY) {
      console.warn('GNews API key not found');
      return await generateMockRelatedArticles(title);
    }

    // Extract key terms from title for better search
    const searchTerms = extractKeyTerms(title);
    console.log('Searching for related articles with terms:', searchTerms);

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

    if (response.data.articles) {
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
        }));
    } else {
      throw new Error('No articles found in GNews response');
    }
  } catch (error) {
    console.error('GNews error:', error);
    // Fallback to mock data
    return await generateMockRelatedArticles(title);
  }
};

// Fallback function using GNews when NewsAPI fails
const fetchFromGNews = async (keyword: string, pageSize: number): Promise<NewsArticle[]> => {
  try {
    const { GNEWS_API_KEY } = getApiKeys();
    
    if (!GNEWS_API_KEY) {
      return [];
    }

    console.log('Fetching from GNews as fallback');

    const response = await axios.get('https://gnews.io/api/v4/search', {
      params: {
        q: keyword,
        token: GNEWS_API_KEY,
        lang: 'en',
        max: pageSize,
        sortby: 'publishedAt'
      },
      timeout: 10000
    });

    if (response.data.articles) {
      return response.data.articles.map((article: any) => ({
        ...article,
        source: { id: '', name: article.source.name || 'Unknown' }
      }));
    }
    return [];
  } catch (error) {
    console.error('GNews fallback error:', error);
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

// Generate mock related articles when APIs fail
const generateMockRelatedArticles = (title: string): NewsArticle[] => {
  const keyTerms = extractKeyTerms(title);
  const sources = [
    { name: 'Reuters', bias: 'center' },
    { name: 'BBC News', bias: 'center-left' },
    { name: 'CNN', bias: 'left' },
    { name: 'Fox News', bias: 'right' },
    { name: 'The Guardian', bias: 'left' },
    { name: 'Wall Street Journal', bias: 'center-right' }
  ];
  
  return sources.map((source, index) => {
    // Generate different headlines based on source bias
    const biasedTitle = generateBiasedHeadline(keyTerms, source.bias);
    
    return {
    title: biasedTitle,
    description: `${source.name}'s perspective on the developing story about ${keyTerms}. This article provides additional context and analysis from a ${source.bias} viewpoint.`,
    url: `https://example.com/${source.name.toLowerCase().replace(/\s+/g, '')}/article-${index}`,
    urlToImage: '',
    publishedAt: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(), // Random date within last week
    source: { id: '', name: source.name },
    content: generateBiasedContent(keyTerms, source.bias, source.name)
    };
  });
};

// Generate headlines with different bias perspectives
const generateBiasedHeadline = (keyTerms: string, bias: string): string => {
  const terms = keyTerms.split(' ').slice(0, 2).join(' ');
  
  switch (bias) {
    case 'left':
      return `Progressive Leaders Rally Around ${terms} Initiative`;
    case 'center-left':
      return `New ${terms} Policy Draws Mixed Reactions`;
    case 'center':
      return `${terms} Development: What You Need to Know`;
    case 'center-right':
      return `${terms} Plan Faces Economic Scrutiny`;
    case 'right':
      return `Conservative Groups Challenge ${terms} Proposal`;
    default:
      return `Breaking: ${terms} Story Develops`;
  }
};

// Generate content with different bias perspectives
const generateBiasedContent = (keyTerms: string, bias: string, sourceName: string): string => {
  const baseContent = `This is a ${sourceName} report on ${keyTerms}. `;
  
  switch (bias) {
    case 'left':
      return baseContent + `Progressive activists are celebrating this groundbreaking development as a major victory for social justice and environmental protection. The initiative represents unprecedented progress in addressing systemic inequalities and climate change. According to advocacy groups, this remarkable achievement demonstrates the power of grassroots organizing and community action.`;
    case 'center-left':
      return baseContent + `The new policy has received cautious support from liberal lawmakers who see it as a step forward, though some express concerns about implementation challenges. Democratic leaders emphasize the importance of ensuring adequate funding and oversight. Experts suggest this could be a significant development if properly executed.`;
    case 'center':
      return baseContent + `Officials report that the development will require careful analysis and stakeholder input before moving forward. According to government sources, multiple factors must be considered to ensure effective implementation. Researchers indicate that both benefits and challenges are expected as the situation evolves.`;
    case 'center-right':
      return baseContent + `Business leaders and fiscal conservatives are raising questions about the economic impact and long-term sustainability of the proposal. Industry analysts warn of potential market disruptions and increased regulatory burden. The plan faces scrutiny from those concerned about government overreach and fiscal responsibility.`;
    case 'right':
      return baseContent + `Conservative groups are strongly opposing this radical proposal, calling it a dangerous expansion of government power that threatens individual liberty and free market principles. Traditional values advocates warn this represents an alarming trend toward socialist policies that could devastate the economy and undermine constitutional rights.`;
    default:
      return baseContent + `The situation continues to develop with various stakeholders expressing different viewpoints on the matter.`;
  }
};

// Enhanced media bias database with more sources
export const mediaBiasDatabase: Record<string, BiasRating> = {
  // Wire Services & International
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

// Enhanced article content extraction (keeping existing function but improving it)
export const extractArticleContent = async (url: string): Promise<string> => {
  try {
    console.log('Extracting content from URL:', url);
    
    // Try multiple proxy services
    const proxyServices = [
      `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
      `https://corsproxy.io/?${encodeURIComponent(url)}`,
      `https://cors-anywhere.herokuapp.com/${url}`
    ];
    
    let response;
    for (const proxyUrl of proxyServices) {
      try {
        response = await axios.get(proxyUrl, { timeout: 10000 });
        if (response.data) break;
      } catch (error) {
        console.log(`Proxy ${proxyUrl} failed, trying next...`);
        continue;
      }
    }
    
    if (!response) {
      throw new Error('All proxy services failed');
    }
    
    const htmlContent = response.data.contents || response.data;
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    
    // Remove unwanted elements
    const unwantedSelectors = [
      'script', 'style', 'nav', 'header', 'footer', 'aside',
      '.advertisement', '.ad', '.social-share', '.comments'
    ];
    
    unwantedSelectors.forEach(selector => {
      const elements = doc.querySelectorAll(selector);
      elements.forEach(el => el.remove());
    });
    
    // Extract main content with priority selectors
    const contentSelectors = [
      'article',
      '.article-content',
      '.post-content',
      '.entry-content',
      '.story-body',
      '.article-body',
      'main',
      '.content'
    ];

    for (const selector of contentSelectors) {
      const element = doc.querySelector(selector);
      if (element) {
        const content = element.textContent || '';
        if (content.length > 500) {
          return content.trim();
        }
      }
    }
    
    // Fallback to body content
    const bodyContent = doc.body?.textContent || '';
    return bodyContent.trim();
    
  } catch (error) {
    console.error('Error extracting article content:', error);
    return '';
  }
};