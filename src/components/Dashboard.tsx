import React from 'react';
import { BarChart3, TrendingUp, Eye, BookOpen, Calendar, Users, Target, Zap, Award } from 'lucide-react';
import { useBias } from '../context/BiasContext';

export const Dashboard: React.FC = () => {
  const { darkMode } = useBias();
  
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
    { label: 'Articles Analyzed', value: '247', icon: BookOpen, color: 'from-blue-500 to-blue-600', change: '+12%' },
    { label: 'Bias Alerts', value: '12', icon: Target, color: 'from-yellow-500 to-yellow-600', change: '-8%' },
    { label: 'Sources Tracked', value: '89', icon: Eye, color: 'from-green-500 to-green-600', change: '+23%' },
    { label: 'Reading Streak', value: '15 days', icon: Award, color: 'from-purple-500 to-purple-600', change: 'New!' },
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6 py-8">
        <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30 backdrop-blur-sm">
          <BarChart3 className="w-4 h-4 text-green-400" />
          <span className={`text-sm font-medium ${darkMode ? 'text-green-300' : 'text-green-600'}`}>
            Personal Analytics
          </span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
          <span className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
            Your Reading
          </span>
          <br />
          <span className={`${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Analytics
          </span>
        </h1>
        
        <p className={`text-lg max-w-2xl mx-auto leading-relaxed ${
          darkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          Track your news consumption patterns, bias exposure, and reading habits over time.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`relative overflow-hidden rounded-2xl border backdrop-blur-xl transition-all duration-300 hover:scale-105 group ${
                darkMode 
                  ? 'bg-white/5 border-white/10 hover:bg-white/10' 
                  : 'bg-white/80 border-gray-200/50 hover:bg-white/90'
              }`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
              
              <div className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    stat.change.includes('+') ? 'bg-green-500/20 text-green-400' :
                    stat.change.includes('-') ? 'bg-red-500/20 text-red-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    {stat.change}
                  </span>
                </div>
                
                <div className={`text-3xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {stat.value}
                </div>
                <div className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {stat.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bias History Chart */}
        <div className={`relative overflow-hidden rounded-3xl border backdrop-blur-xl transition-all duration-300 ${
          darkMode 
            ? 'bg-white/5 border-white/10' 
            : 'bg-white/80 border-gray-200/50'
        }`}>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5"></div>
          
          <div className="relative p-8">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Bias Exposure History
                </h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Last 5 days of reading patterns
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              {biasHistory.map((day, index) => {
                const total = day.left + day.center + day.right;
                return (
                  <div key={index} className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </span>
                      <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {total} articles
                      </span>
                    </div>
                    <div className="flex h-3 bg-gray-700/20 rounded-full overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-1000" 
                        style={{ width: `${(day.left / total) * 100}%` }}
                      />
                      <div 
                        className="bg-gradient-to-r from-gray-400 to-gray-500 transition-all duration-1000" 
                        style={{ width: `${(day.center / total) * 100}%` }}
                      />
                      <div 
                        className="bg-gradient-to-r from-red-500 to-red-600 transition-all duration-1000" 
                        style={{ width: `${(day.right / total) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="flex items-center justify-center space-x-6 mt-6 pt-6 border-t border-white/10">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
                <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Left</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full"></div>
                <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Center</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gradient-to-r from-red-500 to-red-600 rounded-full"></div>
                <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Right</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Sources */}
        <div className={`relative overflow-hidden rounded-3xl border backdrop-blur-xl transition-all duration-300 ${
          darkMode 
            ? 'bg-white/5 border-white/10' 
            : 'bg-white/80 border-gray-200/50'
        }`}>
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-blue-500/5 to-purple-500/5"></div>
          
          <div className="relative p-8">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Top Sources
                </h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Most read news sources
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              {topSources.map((source, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-200 hover:scale-105 ${
                    darkMode 
                      ? 'bg-white/5 border-white/10 hover:bg-white/10' 
                      : 'bg-white/60 border-gray-200/50 hover:bg-white/80'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-white text-sm font-bold">
                          {source.name.charAt(0)}
                        </span>
                      </div>
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{index + 1}</span>
                      </div>
                    </div>
                    <div>
                      <div className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {source.name}
                      </div>
                      <div className={`text-xs capitalize ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {source.bias} • {source.factuality}/10 factuality
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {source.articles}
                    </div>
                    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      articles
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};