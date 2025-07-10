import axios from 'axios';

export interface ExtractedArticle {
  title: string;
  content: string;
  author: string;
  publishDate: string;
  source: string;
  url: string;
  imageUrl?: string;
}

// Real article extraction using free APIs and CORS proxies
export const extractArticleFromUrl = async (url: string): Promise<ExtractedArticle | null> => {
  try {
    console.log('Extracting article from:', url);
    
    let response;
    let htmlContent = '';
    
    // Try multiple free CORS proxy services
    const proxyServices = [
      `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
      `https://corsproxy.io/?${encodeURIComponent(url)}`,
      `https://cors-anywhere.herokuapp.com/${url}`,
      `https://thingproxy.freeboard.io/fetch/${url}`
    ];
    
    for (const proxyUrl of proxyServices) {
      try {
        console.log('Trying proxy:', proxyUrl);
        response = await axios.get(proxyUrl, { 
          timeout: 15000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });
        
        htmlContent = response.data.contents || response.data;
        
        if (htmlContent && htmlContent.length > 500) {
          console.log('Successfully fetched content, length:', htmlContent.length);
          break;
        }
      } catch (proxyError) {
        console.log(`Proxy ${proxyUrl} failed:`, proxyError.message);
        continue;
      }
    }
    
    if (!htmlContent || htmlContent.length < 500) {
      console.log('All proxies failed or insufficient content, trying direct fetch...');
      
      // Try direct fetch as last resort
      try {
        response = await axios.get(url, { 
          timeout: 10000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });
        htmlContent = response.data;
      } catch (directError) {
        console.log('Direct fetch also failed:', directError.message);
        throw new Error('Unable to fetch article content from any source');
      }
    }
    
    if (!htmlContent || htmlContent.length < 100) {
      throw new Error('Insufficient HTML content retrieved');
    }
    
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    
    // Extract article components
    const title = extractTitle(doc, url);
    const content = extractContent(doc);
    const author = extractAuthor(doc);
    const publishDate = extractPublishDate(doc);
    const source = extractSource(doc, url);
    const imageUrl = extractImageUrl(doc);
    
    // Validate extracted data
    if (!title || !content || content.length < 200) {
      throw new Error('Insufficient article content extracted');
    }
    
    console.log('Successfully extracted article:', { 
      title: title.substring(0, 50) + '...', 
      contentLength: content.length,
      source,
      author
    });
    
    return {
      title: title.trim(),
      content: content.trim(),
      author: author.trim(),
      publishDate,
      source,
      url,
      imageUrl
    };

  } catch (error) {
    console.error('Error extracting article:', error);
    throw error;
  }
};

// Enhanced title extraction with multiple selectors
const extractTitle = (doc: Document, url: string): string => {
  const titleSelectors = [
    'h1[class*="title"]',
    'h1[class*="headline"]',
    'h1[id*="title"]',
    'h1[id*="headline"]',
    '.article-title h1',
    '.post-title h1',
    '.entry-title h1',
    'article h1',
    'main h1',
    'h1',
    '[property="og:title"]',
    '[name="twitter:title"]',
    'title'
  ];
  
  for (const selector of titleSelectors) {
    const element = doc.querySelector(selector);
    if (element) {
      const title = element.getAttribute('content') || element.textContent;
      if (title && title.trim().length > 10 && title.trim().length < 200) {
        return title.trim();
      }
    }
  }
  
  // Fallback to URL-based title
  try {
    const urlObj = new URL(url);
    return `Article from ${urlObj.hostname}`;
  } catch {
    return 'Unknown Article';
  }
};

// Enhanced content extraction with better selectors and cleaning
const extractContent = (doc: Document): string => {
  // Remove unwanted elements first
  const unwantedSelectors = [
    'script', 'style', 'nav', 'header', 'footer', 'aside',
    '.advertisement', '.ad', '.ads', '.social-share', '.comments',
    '.related-articles', '.newsletter', '.subscription', '.paywall',
    '.cookie-notice', '.popup', '.modal', '.sidebar', '.menu',
    '[class*="ad-"]', '[id*="ad-"]', '[class*="advertisement"]',
    '.social-media', '.share-buttons', '.author-bio', '.tags'
  ];
  
  unwantedSelectors.forEach(selector => {
    const elements = doc.querySelectorAll(selector);
    elements.forEach(el => el.remove());
  });
  
  // Content extraction selectors in order of preference
  const contentSelectors = [
    'article[role="main"]',
    'main article',
    '[role="main"] article',
    'article .article-body',
    'article .post-content',
    'article .entry-content',
    'article .content',
    '.article-content',
    '.post-content',
    '.entry-content',
    '.story-body',
    '.article-body',
    '.post-body',
    '.content-body',
    'main .content',
    'article',
    'main',
    '.content'
  ];

  for (const selector of contentSelectors) {
    const element = doc.querySelector(selector);
    if (element) {
      const content = extractTextFromElement(element);
      if (content.length > 500) { // Ensure substantial content
        return content;
      }
    }
  }

  // Fallback: extract from body with better filtering
  const body = doc.body;
  if (body) {
    return extractTextFromElement(body);
  }

  return '';
};

// Helper function to extract clean text from an element
const extractTextFromElement = (element: Element): string => {
  // Clone the element to avoid modifying the original
  const clone = element.cloneNode(true) as Element;
  
  // Remove unwanted child elements
  const unwantedChildren = clone.querySelectorAll(
    'script, style, nav, header, footer, aside, .ad, .advertisement, ' +
    '.social-share, .comments, .related, .newsletter, .subscription, ' +
    '.author-bio, .tags, .social-media'
  );
  unwantedChildren.forEach(el => el.remove());
  
  // Get text content and clean it
  let text = clone.textContent || '';
  
  // Clean up the text
  text = text
    .replace(/\s+/g, ' ') // Normalize whitespace
    .replace(/\n\s*\n/g, '\n\n') // Normalize line breaks
    .replace(/[^\w\s.,!?;:()\-"']/g, ' ') // Remove special characters except basic punctuation
    .trim();
  
  return text;
};

// Enhanced author extraction
const extractAuthor = (doc: Document): string => {
  const authorSelectors = [
    '[rel="author"]',
    '[property="article:author"]',
    '[name="author"]',
    '.author-name',
    '.byline-author',
    '.article-author',
    '.post-author',
    '.by-author',
    '.author',
    '.byline',
    '[itemprop="author"]'
  ];
  
  for (const selector of authorSelectors) {
    const element = doc.querySelector(selector);
    if (element) {
      const author = element.getAttribute('content') || element.textContent;
      if (author && author.trim().length > 2 && author.trim().length < 100) {
        // Clean author name
        return author.replace(/^(by|author:?)\s*/i, '').trim();
      }
    }
  }
  
  return 'Unknown Author';
};

// Enhanced publish date extraction
const extractPublishDate = (doc: Document): string => {
  const dateSelectors = [
    '[property="article:published_time"]',
    '[property="article:published"]',
    '[name="publish_date"]',
    '[name="date"]',
    'time[datetime]',
    '.publish-date',
    '.article-date',
    '.post-date',
    '.date',
    '[itemprop="datePublished"]'
  ];
  
  for (const selector of dateSelectors) {
    const element = doc.querySelector(selector);
    if (element) {
      const dateStr = element.getAttribute('content') || 
                     element.getAttribute('datetime') || 
                     element.textContent;
      
      if (dateStr) {
        const date = new Date(dateStr);
        if (!isNaN(date.getTime())) {
          return date.toISOString();
        }
      }
    }
  }
  
  return new Date().toISOString();
};

// Enhanced source extraction
const extractSource = (doc: Document, url: string): string => {
  const sourceSelectors = [
    '[property="og:site_name"]',
    '[name="application-name"]',
    '.site-name',
    '.source-name',
    '.publication-name',
    '[itemprop="publisher"]'
  ];
  
  for (const selector of sourceSelectors) {
    const element = doc.querySelector(selector);
    if (element) {
      const source = element.getAttribute('content') || element.textContent;
      if (source && source.trim().length > 2) {
        return source.trim();
      }
    }
  }
  
  // Fallback to hostname
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace('www.', '');
  } catch {
    return 'Unknown Source';
  }
};

// Enhanced image extraction
const extractImageUrl = (doc: Document): string | undefined => {
  const imageSelectors = [
    '[property="og:image"]',
    '[name="twitter:image"]',
    '[name="twitter:image:src"]',
    '.article-image img',
    '.post-image img',
    'article img',
    'main img'
  ];
  
  for (const selector of imageSelectors) {
    const element = doc.querySelector(selector);
    if (element) {
      const imageUrl = element.getAttribute('content') || 
                      element.getAttribute('src') ||
                      element.getAttribute('data-src');
      
      if (imageUrl && imageUrl.startsWith('http')) {
        return imageUrl;
      }
    }
  }
  
  return undefined;
};