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

// Mercury Web Parser API alternative - using a combination of methods
export const extractArticleFromUrl = async (url: string): Promise<ExtractedArticle | null> => {
  try {
    // Method 1: Try using a CORS proxy with article extraction
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
    const response = await axios.get(proxyUrl);
    
    const parser = new DOMParser();
    const doc = parser.parseFromString(response.data.contents, 'text/html');
    
    // Extract title
    const title = doc.querySelector('h1')?.textContent || 
                 doc.querySelector('title')?.textContent || 
                 doc.querySelector('[property="og:title"]')?.getAttribute('content') || 
                 'Unknown Title';

    // Extract content
    let content = '';
    const contentSelectors = [
      'article',
      '.article-content',
      '.post-content',
      '.entry-content',
      '.content',
      'main',
      '.story-body',
      '.article-body'
    ];

    for (const selector of contentSelectors) {
      const element = doc.querySelector(selector);
      if (element) {
        // Remove scripts, styles, and ads
        const unwanted = element.querySelectorAll('script, style, .ad, .advertisement, .social-share');
        unwanted.forEach(el => el.remove());
        
        content = element.textContent || '';
        if (content.length > 500) break; // Found substantial content
      }
    }

    // Fallback to body content if no specific content area found
    if (!content || content.length < 500) {
      const body = doc.body?.cloneNode(true) as HTMLElement;
      if (body) {
        // Remove unwanted elements
        const unwanted = body.querySelectorAll('script, style, nav, header, footer, .ad, .advertisement, .menu, .sidebar');
        unwanted.forEach(el => el.remove());
        content = body.textContent || '';
      }
    }

    // Extract metadata
    const author = doc.querySelector('[name="author"]')?.getAttribute('content') ||
                  doc.querySelector('[property="article:author"]')?.getAttribute('content') ||
                  doc.querySelector('.author')?.textContent ||
                  'Unknown Author';

    const publishDate = doc.querySelector('[property="article:published_time"]')?.getAttribute('content') ||
                       doc.querySelector('[name="publish_date"]')?.getAttribute('content') ||
                       doc.querySelector('time')?.getAttribute('datetime') ||
                       new Date().toISOString();

    const source = new URL(url).hostname.replace('www.', '');

    const imageUrl = doc.querySelector('[property="og:image"]')?.getAttribute('content') ||
                    doc.querySelector('meta[name="twitter:image"]')?.getAttribute('content');

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
    
    // Fallback: Try to extract basic info from URL
    try {
      const urlObj = new URL(url);
      return {
        title: 'Article from ' + urlObj.hostname,
        content: 'Unable to extract full content. Please check the original article.',
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

// Alternative method using Readability.js-like extraction
export const extractReadableContent = (htmlContent: string): string => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');
  
  // Score paragraphs based on content quality
  const paragraphs = Array.from(doc.querySelectorAll('p'));
  const scoredParagraphs = paragraphs.map(p => {
    const text = p.textContent || '';
    let score = 0;
    
    // Scoring criteria
    if (text.length > 50) score += 1;
    if (text.length > 100) score += 1;
    if (text.includes('.')) score += 1;
    if (text.split(' ').length > 10) score += 1;
    
    // Penalty for likely non-content
    if (text.includes('cookie') || text.includes('subscribe') || text.includes('advertisement')) {
      score -= 2;
    }
    
    return { element: p, score, text };
  });
  
  // Get top-scoring paragraphs
  const topParagraphs = scoredParagraphs
    .filter(p => p.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 20)
    .map(p => p.text);
  
  return topParagraphs.join('\n\n');
};