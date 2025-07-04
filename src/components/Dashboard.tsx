import React from 'react';
import { BarChart3, TrendingUp, Eye, BookOpen, Calendar, Users } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const biasHistory = [
    { date: '2024-01-15', left: 3, center: 7, right: 2 },
    { date: '2024-01-14', left: 5, center: 4, right: 3 },
    { date: '2024-01-13', left: 2, center: 8, right: 2 },
    { date: '2024-01-12', left: 4, center: 5, right: 3 },
    { date: '2024-01-11', left: 6, center: 3, right: 3 },
  ];

  const topSources = [
    { name: 'Reuters', articles: 45, bias: 'center', factuality: 9.2 },
    { name: 'BBC News', articles: 32, bias: 'center-left', factuality: 8.8 },
    { name: 'Associated Press', articles: 28, bias: 'center', factuality: 9.1 },
    { name: 'The Guardian', articles: 24, bias: 'center-left', factuality: 8.3 },
    { name: 'Wall Street Journal', articles: 19, bias: 'center-right', factuality: 8.7 },
  ];

  const stats = [
    { label: 'Articles Analyzed', value: '247', icon: BookOpen, color: 'bg-blue-500' },
    { label: 'Bias Alerts', value: '12', icon: TrendingUp, color: 'bg-yellow-500' },
    { label: 'Sources Tracked', value: '89', icon: Eye, color: 'bg-green-500' },
    { label: 'Reading Streak', value: '15 days', icon: Calendar, color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
          Your Reading Analytics
        </h2>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Track your news consumption patterns and bias exposure over time.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20">
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-gray-300">{stat.label}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
            <BarChart3 className="w-5 h-5" />
            <span>Bias Exposure History</span>
          </h3>
          <div className="space-y-4">
            {biasHistory.map((day, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm text-gray-300">
                  <span>{new Date(day.date).toLocaleDateString()}</span>
                  <span>{day.left + day.center + day.right} articles</span>
                </div>
                <div className="flex h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="bg-blue-500" 
                    style={{ width: `${(day.left / (day.left + day.center + day.right)) * 100}%` }}
                  />
                  <div 
                    className="bg-gray-500" 
                    style={{ width: `${(day.center / (day.left + day.center + day.right)) * 100}%` }}
                  />
                  <div 
                    className="bg-red-500" 
                    style={{ width: `${(day.right / (day.left + day.center + day.right)) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center space-x-4 mt-4 text-sm text-gray-300">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Left</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
              <span>Center</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Right</span>
            </div>
          </div>
        </div>

        <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>Top Sources</span>
          </h3>
          <div className="space-y-3">
            {topSources.map((source, index) => (
              <div key={index} className="flex items-center justify-between p-3 backdrop-blur-md bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                    {source.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-white font-medium">{source.name}</div>
                    <div className="text-xs text-gray-300 capitalize">{source.bias}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-medium">{source.articles}</div>
                  <div className="text-xs text-gray-300">articles</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};