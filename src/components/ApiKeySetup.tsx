import React, { useState, useEffect } from 'react';
import { Key, Save, AlertCircle, CheckCircle } from 'lucide-react';
import { useBias } from '../context/BiasContext';

export const ApiKeySetup: React.FC = () => {
  const { darkMode } = useBias();
  const [keys, setKeys] = useState({
    newsApi: '',
    gnews: ''
  });

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Pre-populate with provided API keys
    const newsApiKey = '31e6e924e5ff4d848aba695ef03b9fc4';
    const gnewsApiKey = '156b6e0dfb628ef49546571f45174081';
    
    setKeys({
      newsApi: newsApiKey,
      gnews: gnewsApiKey
    });

    // Save to localStorage
    localStorage.setItem('newsApiKey', newsApiKey);
    localStorage.setItem('gnewsApiKey', gnewsApiKey);
  }, []);

  const handleSave = () => {
    Object.entries(keys).forEach(([key, value]) => {
      if (value) {
        localStorage.setItem(key === 'newsApi' ? 'newsApiKey' : 'gnewsApiKey', value);
      }
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className={`backdrop-blur-md rounded-2xl p-6 border mb-6 transition-colors duration-300 ${
      darkMode 
        ? 'bg-white/10 border-white/20' 
        : 'bg-black/5 border-black/10'
    }`}>
      <div className="flex items-center space-x-2 mb-4">
        <Key className="w-5 h-5 text-yellow-400" />
        <h3 className={`text-lg font-semibold transition-colors duration-300 ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>API Configuration</h3>
      </div>
      
      <div className="mb-4 p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
        <div className="flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-green-400" />
          <h4 className={`font-medium transition-colors duration-300 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>API Keys Configured!</h4>
        </div>
        <p className={`text-sm mt-1 transition-colors duration-300 ${
          darkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          Your NewsAPI and GNews keys are already set up and ready to use.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className={`block text-sm font-medium mb-1 transition-colors duration-300 ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            NewsAPI Key
          </label>
          <input
            type="password"
            value={keys.newsApi}
            onChange={(e) => setKeys(prev => ({ ...prev, newsApi: e.target.value }))}
            placeholder="Get from newsapi.org"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${
              darkMode 
                ? 'bg-white/10 border-white/20 text-white placeholder-gray-400' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
          />
        </div>
        
        <div>
          <label className={`block text-sm font-medium mb-1 transition-colors duration-300 ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            GNews API Key
          </label>
          <input
            type="password"
            value={keys.gnews}
            onChange={(e) => setKeys(prev => ({ ...prev, gnews: e.target.value }))}
            placeholder="Get from gnews.io"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${
              darkMode 
                ? 'bg-white/10 border-white/20 text-white placeholder-gray-400' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
          />
        </div>
      </div>
      
      <div className="mb-4 p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg">
        <h4 className={`font-medium mb-2 transition-colors duration-300 ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>API Information:</h4>
        <ul className={`text-sm space-y-1 transition-colors duration-300 ${
          darkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          <li>• <strong>NewsAPI:</strong> 100 requests/day (free tier) - <a href="https://newsapi.org" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">newsapi.org</a></li>
          <li>• <strong>GNews:</strong> 100 requests/day (free tier) - <a href="https://gnews.io" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">gnews.io</a></li>
        </ul>
      </div>
      
      <div className="flex items-center justify-between">
        <div className={`flex items-center space-x-2 text-sm transition-colors duration-300 ${
          darkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          <AlertCircle className="w-4 h-4" />
          <span>API keys are stored locally in your browser</span>
        </div>
        
        <button
          onClick={handleSave}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-200"
        >
          {saved ? (
            <>
              <CheckCircle className="w-4 h-4" />
              <span>Saved!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Update Keys</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};