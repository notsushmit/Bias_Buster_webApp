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

// Enhanced article extraction with multiple fallback methods
export const extractArticleFromUrl = async (url: string): Promise<ExtractedArticle | null> => {
  try {
    console.log('Extracting article from:', url);
    
    // Method 1: Try using AllOrigins proxy (free CORS proxy)
    let response;
    try {
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
      response = await axios.get(proxyUrl, { timeout: 15000 });
    } catch (proxyError) {
      console.log('AllOrigins failed, trying alternative method...');
      
      // Method 2: Try using CORS-anywhere alternative
      try {
        const altProxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;
        response = await axios.get(altProxyUrl, { timeout: 15000 });
      } catch (altError) {
        console.log('Alternative proxy failed, using direct fetch...');
        
        // Method 3: Direct fetch (may fail due to CORS)
        response = await axios.get(url, { timeout: 10000 });
      }
    }
    
    const htmlContent = response.data.contents || response.data;
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    
    // Enhanced title extraction
    const title = extractTitle(doc, url);
    
    // Enhanced content extraction
    const content = extractContent(doc);
    
    // Enhanced metadata extraction
    const author = extractAuthor(doc);
    const publishDate = extractPublishDate(doc);
    const source = extractSource(doc, url);
    const imageUrl = extractImageUrl(doc);
    
    // Validate extracted data
    if (!title || !content || content.length < 100) {
      throw new Error('Insufficient content extracted');
    }
    
    console.log('Successfully extracted article:', { title: title.substring(0, 50) + '...', contentLength: content.length });
    
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
    
    // Fallback: Create minimal article data
    try {
      const urlObj = new URL(url);
      const fallbackTitle = `Article from ${urlObj.hostname}`;
      
      return {
        title: fallbackTitle,
        content: `Unable to extract full content from this article. This may be due to the website's security settings or paywall restrictions. Please visit the original article for complete content.`,
        author: 'Unknown',
        publishDate: new Date().toISOString(),
        source: urlObj.hostname.replace('www.', ''),
        url
      };
    } catch {
      return null;
    }
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
    '[class*="ad-"]', '[id*="ad-"]', '[class*="advertisement"]'
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
    '.social-share, .comments, .related, .newsletter, .subscription'
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
    '.byline'
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
    '.date'
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
    '.publication-name'
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

// Alternative extraction method using Readability-like algorithm
export const extractReadableContent = (htmlContent: string): string => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');
  
  // Score paragraphs based on content quality
  const paragraphs = Array.from(doc.querySelectorAll('p'));
  const scoredParagraphs = paragraphs.map(p => {
    const text = p.textContent || '';
    let score = 0;
    
    // Positive scoring criteria
    if (text.length > 50) score += 1;
    if (text.length > 100) score += 2;
    if (text.length > 200) score += 1;
    if (text.includes('.')) score += 1;
    if (text.split(' ').length > 15) score += 2;
    if (text.split(' ').length > 30) score += 1;
    
    // Check for meaningful content indicators
    if (/\b(said|according|reported|stated|announced)\b/i.test(text)) score += 2;
    if (/\b(percent|million|billion|thousand|year|month|day)\b/i.test(text)) score += 1;
    if (/"[^"]{20,}"/g.test(text)) score += 2; // Contains substantial quotes
    
    // Negative scoring criteria
    if (/\b(cookie|subscribe|advertisement|click here|sign up|newsletter)\b/i.test(text)) {
      score -= 3;
    }
    if (text.length < 20) score -= 2;
    if (!/[.!?]/.test(text)) score -= 1; // No sentence endings
    
    return { element: p, score, text };
  });
  
  // Get top-scoring paragraphs
  const topParagraphs = scoredParagraphs
    .filter(p => p.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 30) // Take top 30 paragraphs
    .map(p => p.text)
    .filter(text => text.length > 30); // Filter out very short paragraphs
  
  return topParagraphs.join('\n\n');
};