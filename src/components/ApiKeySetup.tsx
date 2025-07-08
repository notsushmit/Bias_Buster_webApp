import React, { useState, useEffect } from 'react';
import { Key, Save, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { useBias } from '../context/BiasContext';

export const ApiKeySetup: React.FC = () => {
  const { darkMode } = useBias();
  const [keys, setKeys] = useState({
    newsApiKey: '',
    gnewsApiKey: '',
    huggingFaceApiKey: '',
    claimBusterApiKey: '',
  });

  const [saved, setSaved] = useState(false);
  const [allKeysPresent, setAllKeysPresent] = useState(false);

  useEffect(() => {
    const newsApiKey = localStorage.getItem('newsApiKey') || '';
    const gnewsApiKey = localStorage.getItem('gnewsApiKey') || '';
    const huggingFaceApiKey = localStorage.getItem('huggingFaceApiKey') || '';
    const claimBusterApiKey = localStorage.getItem('claimBusterApiKey') || '';
    
    setKeys({
      newsApiKey,
      gnewsApiKey,
      huggingFaceApiKey,
      claimBusterApiKey,
    });

    if (newsApiKey && gnewsApiKey && huggingFaceApiKey && claimBusterApiKey) {
      setAllKeysPresent(true);
    } else {
      setAllKeysPresent(false);
    }
  }, []);

  const handleSave = () => {
    Object.entries(keys).forEach(([keyName, value]) => {
      if (value) {
        localStorage.setItem(keyName, value);
      } else {
        localStorage.removeItem(keyName); // Remove if field is cleared
      }
    });
    setSaved(true);
    if (keys.newsApiKey && keys.gnewsApiKey && keys.huggingFaceApiKey && keys.claimBusterApiKey) {
      setAllKeysPresent(true);
    } else {
      setAllKeysPresent(false);
    }
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
        }`}>API Key Configuration</h3>
      </div>
      
      {allKeysPresent && (
        <div className="mb-4 p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <h4 className={`font-medium transition-colors duration-300 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>All API Keys Configured!</h4>
          </div>
          <p className={`text-sm mt-1 transition-colors duration-300 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Your API keys for NewsAPI, GNews, Hugging Face, and ClaimBuster are set up.
          </p>
        </div>
      )}
      {!allKeysPresent && (
         <div className="mb-4 p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
          <div className="flex items-center space-x-2">
            <Info className="w-5 h-5 text-yellow-400" />
            <h4 className={`font-medium transition-colors duration-300 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>Missing API Keys</h4>
          </div>
          <p className={`text-sm mt-1 transition-colors duration-300 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Please provide all API keys for full functionality. Instructions for obtaining them are below.
          </p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className={`block text-sm font-medium mb-1 transition-colors duration-300 ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            NewsAPI Key
          </label>
          <input
            type="password"
            value={keys.newsApiKey}
            onChange={(e) => setKeys(prev => ({ ...prev, newsApiKey: e.target.value }))}
            placeholder="Required for news fetching"
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
            value={keys.gnewsApiKey}
            onChange={(e) => setKeys(prev => ({ ...prev, gnewsApiKey: e.target.value }))}
            placeholder="Required for related articles"
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
            Hugging Face API Token
          </label>
          <input
            type="password"
            value={keys.huggingFaceApiKey}
            onChange={(e) => setKeys(prev => ({ ...prev, huggingFaceApiKey: e.target.value }))}
            placeholder="For emotional intensity analysis"
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
            ClaimBuster API Key
          </label>
          <input
            type="password"
            value={keys.claimBusterApiKey}
            onChange={(e) => setKeys(prev => ({ ...prev, claimBusterApiKey: e.target.value }))}
            placeholder="For factuality analysis"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${
              darkMode 
                ? 'bg-white/10 border-white/20 text-white placeholder-gray-400' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
          />
        </div>
      </div>
      
      <div className="mb-6 p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg">
        <h4 className={`font-medium mb-2 transition-colors duration-300 ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>API Information & How to Obtain Keys:</h4>
        <ul className={`text-sm space-y-2 transition-colors duration-300 ${
          darkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          <li>• <strong>NewsAPI:</strong> For fetching general news articles. Free tier available. Get key at <a href="https://newsapi.org" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">newsapi.org</a>.</li>
          <li>• <strong>GNews:</strong> For fetching related articles. Free tier available. Get key at <a href="https://gnews.io" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">gnews.io</a>.</li>
          <li>• <strong>Hugging Face:</strong> For emotional intensity analysis. Use an Access Token with `read` permissions. Free tier for Inference API. Get token from <a href="https://huggingface.co/settings/tokens" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">huggingface.co/settings/tokens</a>.</li>
          <li>• <strong>ClaimBuster:</strong> For factuality analysis and claim detection. Request a free API key at <a href="https://idir.uta.edu/claimbuster/api/#requestkey" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">idir.uta.edu/claimbuster/api/</a> (click "request a key").</li>
        </ul>
      </div>
      
      <div className="flex items-center justify-between">
        <div className={`flex items-center space-x-2 text-sm transition-colors duration-300 ${
          darkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          <AlertCircle className="w-4 h-4" />
          <span>API keys are stored locally in your browser.</span>
        </div>
        
        <button
          onClick={handleSave}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-200 disabled:opacity-60"
        >
          {saved ? (
            <>
              <CheckCircle className="w-4 h-4" />
              <span>Saved!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save All Keys</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};