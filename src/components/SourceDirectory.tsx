import React, { useState } from 'react';
import { Search, Filter, Building, Shield, AlertTriangle, ExternalLink } from 'lucide-react';

export const SourceDirectory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBias, setSelectedBias] = useState('all');

  const sources = [
    { name: 'Reuters', bias: 'center', factuality: 9.2, country: 'UK', category: 'International' },
    { name: 'Associated Press', bias: 'center', factuality: 9.1, country: 'US', category: 'International' },
    { name: 'BBC News', bias: 'center-left', factuality: 8.8, country: 'UK', category: 'International' },
    { name: 'NPR', bias: 'center-left', factuality: 8.9, country: 'US', category: 'National' },
    { name: 'Wall Street Journal', bias: 'center-right', factuality: 8.7, country: 'US', category: 'Business' },
    { name: 'The Guardian', bias: 'center-left', factuality: 8.3, country: 'UK', category: 'International' },
    { name: 'Fox News', bias: 'right', factuality: 6.8, country: 'US', category: 'National' },
    { name: 'CNN', bias: 'center-left', factuality: 7.4, country: 'US', category: 'National' },
    { name: 'The New York Times', bias: 'center-left', factuality: 8.1, country: 'US', category: 'National' },
    { name: 'Financial Times', bias: 'center-right', factuality: 8.6, country: 'UK', category: 'Business' },
  ];

  const filteredSources = sources.filter(source => {
    const matchesSearch = source.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBias = selectedBias === 'all' || source.bias === selectedBias;
    return matchesSearch && matchesBias;
  });

  const getBiasColor = (bias: string) => {
    switch (bias) {
      case 'left': return 'bg-blue-500';
      case 'center-left': return 'bg-blue-400';
      case 'center': return 'bg-gray-500';
      case 'center-right': return 'bg-red-400';
      case 'right': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getFactualityColor = (score: number) => {
    if (score >= 8) return 'text-green-400';
    if (score >= 6) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
          News Source Directory
        </h2>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Explore bias ratings and factuality scores for major news organizations worldwide.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search news sources..."
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <select
                value={selectedBias}
                onChange={(e) => setSelectedBias(e.target.value)}
                className="pl-10 pr-8 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white appearance-none min-w-[150px]"
              >
                <option value="all">All Bias Types</option>
                <option value="left">Left</option>
                <option value="center-left">Center-Left</option>
                <option value="center">Center</option>
                <option value="center-right">Center-Right</option>
                <option value="right">Right</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSources.map((source, index) => (
            <div key={index} className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Building className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{source.name}</h3>
                    <p className="text-gray-300 text-sm">{source.country}</p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400 hover:text-white transition-colors cursor-pointer" />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Political Bias</span>
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${getBiasColor(source.bias)}`}></div>
                    <span className="text-sm text-white capitalize">{source.bias}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Factuality</span>
                  <span className={`text-sm font-medium ${getFactualityColor(source.factuality)}`}>
                    {source.factuality}/10
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Category</span>
                  <span className="text-sm text-white">{source.category}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="flex items-center space-x-2 text-xs text-gray-400">
                  <Shield className="w-3 h-3" />
                  <span>Verified Source</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};