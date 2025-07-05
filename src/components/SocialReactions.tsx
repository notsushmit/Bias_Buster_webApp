import React from 'react';
import { MessageCircle, ThumbsUp, ThumbsDown, ExternalLink } from 'lucide-react';

interface SocialReaction {
  platform: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  engagement: number;
  topComments: string[];
  url: string;
}

interface SocialReactionsProps {
  reactions: SocialReaction[];
}

export const SocialReactions: React.FC<SocialReactionsProps> = ({ reactions }) => {
  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return ThumbsUp;
      case 'negative': return ThumbsDown;
      default: return MessageCircle;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-400';
      case 'negative': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20">
      <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
        <MessageCircle className="w-5 h-5" />
        <span>Social Media Reactions</span>
      </h3>
      
      <div className="space-y-4">
        {reactions.map((reaction, index) => {
          const SentimentIcon = getSentimentIcon(reaction.sentiment);
          return (
            <div
              key={index}
              className="backdrop-blur-md bg-white/5 rounded-lg p-4 border border-white/10"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {reaction.platform.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-white font-medium">{reaction.platform}</h4>
                    <div className="flex items-center space-x-2 text-sm">
                      <SentimentIcon className={`w-4 h-4 ${getSentimentColor(reaction.sentiment)}`} />
                      <span className={`capitalize ${getSentimentColor(reaction.sentiment)}`}>
                        {reaction.sentiment}
                      </span>
                      <span className="text-gray-400">• {reaction.engagement} interactions</span>
                    </div>
                  </div>
                </div>
                {reaction.url && (
                  <a
                    href={reaction.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>

              {reaction.topComments.length > 0 && (
                <div className="space-y-2">
                  <h5 className="text-sm font-medium text-gray-300">Top Comments:</h5>
                  {reaction.topComments.slice(0, 3).map((comment, commentIndex) => (
                    <div
                      key={commentIndex}
                      className="text-sm text-gray-300 bg-white/5 rounded p-2 border-l-2 border-blue-500/30"
                    >
                      "{comment.length > 150 ? comment.substring(0, 150) + '...' : comment}"
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};