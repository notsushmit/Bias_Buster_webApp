export interface SocialReaction {
  platform: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  engagement: number;
  topComments: string[];
  url: string;
}

// Mock social media reactions since we're removing external APIs
export const fetchAllSocialReactions = async (articleTitle: string, articleUrl: string): Promise<SocialReaction[]> => {
  try {
    // Generate mock social media reactions based on article title analysis
    const reactions: SocialReaction[] = [];
    
    // Analyze title sentiment to generate realistic mock data
    const titleLower = articleTitle.toLowerCase();
    const isControversial = titleLower.includes('scandal') || titleLower.includes('crisis') || 
                           titleLower.includes('controversy') || titleLower.includes('debate');
    const isPositive = titleLower.includes('success') || titleLower.includes('achievement') || 
                      titleLower.includes('progress') || titleLower.includes('breakthrough');
    
    // Mock Reddit reaction
    const redditSentiment = isControversial ? 'negative' : isPositive ? 'positive' : 'neutral';
    const redditEngagement = isControversial ? Math.floor(Math.random() * 500) + 200 : 
                            isPositive ? Math.floor(Math.random() * 300) + 100 : 
                            Math.floor(Math.random() * 150) + 50;
    
    const redditComments = generateMockComments(redditSentiment, 'reddit');
    
    reactions.push({
      platform: 'Reddit',
      sentiment: redditSentiment,
      engagement: redditEngagement,
      topComments: redditComments,
      url: `https://reddit.com/r/news/comments/mock_${Date.now()}`
    });
    
    // Mock Twitter reaction
    const twitterSentiment = isControversial ? 'negative' : isPositive ? 'positive' : 'neutral';
    const twitterEngagement = Math.floor(Math.random() * 1000) + 100;
    const twitterComments = generateMockComments(twitterSentiment, 'twitter');
    
    reactions.push({
      platform: 'Twitter',
      sentiment: twitterSentiment,
      engagement: twitterEngagement,
      topComments: twitterComments,
      url: `https://twitter.com/search?q=${encodeURIComponent(articleTitle)}`
    });
    
    return reactions;
  } catch (error) {
    console.error('Error generating social reactions:', error);
    return [];
  }
};

// Generate realistic mock comments based on sentiment and platform
const generateMockComments = (sentiment: string, platform: string): string[] => {
  const positiveComments = [
    "This is really encouraging news! Great to see progress being made.",
    "Finally some good news for a change. Thanks for sharing this.",
    "Excellent reporting. This gives me hope for the future.",
    "Well written article with solid facts. Appreciate the balanced perspective.",
    "This is exactly what we needed to hear. Great work by everyone involved."
  ];
  
  const negativeComments = [
    "This is deeply concerning. We need to pay more attention to these issues.",
    "The situation is more complex than this article suggests.",
    "I'm worried about the long-term implications of this development.",
    "This raises serious questions that need to be addressed immediately.",
    "The article misses some important context that changes everything."
  ];
  
  const neutralComments = [
    "Interesting perspective. Would like to see more data on this topic.",
    "Thanks for the update. Will be following this story closely.",
    "Good to stay informed about these developments.",
    "Appreciate the coverage. Looking forward to more details.",
    "This is worth keeping an eye on as it develops further."
  ];
  
  let commentPool: string[];
  switch (sentiment) {
    case 'positive':
      commentPool = positiveComments;
      break;
    case 'negative':
      commentPool = negativeComments;
      break;
    default:
      commentPool = neutralComments;
  }
  
  // Return 3-5 random comments
  const numComments = Math.floor(Math.random() * 3) + 3;
  const shuffled = [...commentPool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numComments);
};