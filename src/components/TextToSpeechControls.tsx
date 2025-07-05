import React, { useState } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  Square, 
  Settings, 
  Headphones,
  ChevronDown,
  Loader2,
  FileText,
  List,
  Zap
} from 'lucide-react';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import { useBias } from '../context/BiasContext';
import { useLanguage } from '../context/LanguageContext';

export const TextToSpeechControls: React.FC = () => {
  const { darkMode } = useBias();
  const { t } = useLanguage();
  const {
    isPlaying,
    isPaused,
    isLoading,
    error,
    currentVoice,
    volume,
    speed,
    availableVoices,
    pause,
    resume,
    stop,
    setVoice,
    setVolume,
    setSpeed,
    readHeaders,
    readPageContent
  } = useTextToSpeech();

  const [showSettings, setShowSettings] = useState(false);
  const [showVoiceSelector, setShowVoiceSelector] = useState(false);
  const [readingMode, setReadingMode] = useState<'headers' | 'content'>('headers');

  const handlePlayPause = () => {
    if (isPlaying) {
      pause();
    } else if (isPaused) {
      resume();
    } else {
      if (readingMode === 'headers') {
        readHeaders();
      } else {
        readPageContent();
      }
    }
  };

  const currentVoiceInfo = availableVoices.find(v => v.id === currentVoice);

  return (
    <div className="relative">
      {/* Main TTS Controls */}
      <div className={`flex items-center space-x-3 p-4 rounded-2xl border backdrop-blur-xl transition-all duration-300 ${
        darkMode 
          ? 'bg-white/10 border-white/20 hover:bg-white/15' 
          : 'bg-white/80 border-gray-200/50 hover:bg-white/90'
      }`}>
        {/* Reading Mode Selector */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setReadingMode('headers')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              readingMode === 'headers'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                : darkMode
                  ? 'bg-white/10 text-gray-300 hover:bg-white/20'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            title="Read Headers"
          >
            <List className="w-4 h-4" />
            <span className="hidden sm:inline">Headers</span>
          </button>
          
          <button
            onClick={() => setReadingMode('content')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              readingMode === 'content'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                : darkMode
                  ? 'bg-white/10 text-gray-300 hover:bg-white/20'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            title="Read Content"
          >
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Content</span>
          </button>
        </div>

        {/* Play/Pause Button */}
        <button
          onClick={handlePlayPause}
          disabled={isLoading}
          className={`flex items-center justify-center w-14 h-14 rounded-xl transition-all duration-200 ${
            isPlaying || isPaused
              ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
              : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
          } text-white shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
          title={
            isLoading ? 'Loading...' :
            isPlaying ? 'Pause Reading' :
            isPaused ? 'Resume Reading' :
            readingMode === 'headers' ? 'Read All Headers' : 'Read Page Content'
          }
        >
          {isLoading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : isPlaying ? (
            <Pause className="w-6 h-6" />
          ) : (
            <Play className="w-6 h-6 ml-0.5" />
          )}
        </button>

        {/* Stop Button */}
        {(isPlaying || isPaused) && (
          <button
            onClick={stop}
            className={`flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 ${
              darkMode 
                ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400' 
                : 'bg-red-500/10 hover:bg-red-500/20 text-red-600'
            } hover:scale-105`}
            title="Stop Reading"
          >
            <Square className="w-5 h-5" />
          </button>
        )}

        {/* Volume Control */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setVolume(volume > 0 ? 0 : 0.8)}
            className={`p-2 rounded-lg transition-colors ${
              darkMode 
                ? 'hover:bg-white/10 text-gray-300' 
                : 'hover:bg-gray-100 text-gray-600'
            }`}
            title={volume > 0 ? 'Mute' : 'Unmute'}
          >
            {volume > 0 ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
          
          <div className="relative">
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-20 h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer slider"
              title={`Volume: ${Math.round(volume * 100)}%`}
            />
          </div>
        </div>

        {/* Settings Button */}
        <button
          onClick={() => setShowSettings(!showSettings)}
          className={`p-3 rounded-xl transition-all duration-200 ${
            showSettings
              ? darkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-500/10 text-blue-600'
              : darkMode ? 'hover:bg-white/10 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
          } hover:scale-105`}
          title="TTS Settings"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowSettings(false)}
          />
          
          {/* Settings Dropdown */}
          <div className={`absolute top-full right-0 mt-3 w-96 rounded-2xl border backdrop-blur-xl shadow-2xl z-50 overflow-hidden ${
            darkMode 
              ? 'bg-white/10 border-white/20' 
              : 'bg-white/90 border-gray-200/50'
          }`}>
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Headphones className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Text-to-Speech Settings
                  </h3>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Customize voice and playback options
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Voice Selection */}
                <div>
                  <label className={`block text-sm font-medium mb-3 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Voice Selection
                  </label>
                  <div className="relative">
                    <button
                      onClick={() => setShowVoiceSelector(!showVoiceSelector)}
                      className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${
                        darkMode 
                          ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white' 
                          : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-900'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
                          <span className="text-white text-sm font-bold">
                            {currentVoiceInfo?.name.charAt(0)}
                          </span>
                        </div>
                        <div className="text-left">
                          <div className="font-medium">{currentVoiceInfo?.name}</div>
                          <div className={`text-xs capitalize ${
                            darkMode ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {currentVoiceInfo?.gender} • {currentVoiceInfo?.accent}
                          </div>
                        </div>
                      </div>
                      <ChevronDown className={`w-5 h-5 transition-transform ${
                        showVoiceSelector ? 'rotate-180' : ''
                      }`} />
                    </button>

                    {showVoiceSelector && (
                      <div className={`absolute top-full left-0 right-0 mt-2 rounded-xl border backdrop-blur-xl shadow-xl z-10 max-h-64 overflow-y-auto ${
                        darkMode 
                          ? 'bg-white/10 border-white/20' 
                          : 'bg-white/90 border-gray-200/50'
                      }`}>
                        {availableVoices.map((voice) => (
                          <button
                            key={voice.id}
                            onClick={() => {
                              setVoice(voice.id);
                              setShowVoiceSelector(false);
                            }}
                            className={`w-full flex items-center space-x-3 p-4 text-left transition-colors ${
                              voice.id === currentVoice
                                ? darkMode
                                  ? 'bg-blue-500/20 text-blue-300'
                                  : 'bg-blue-500/10 text-blue-600'
                                : darkMode
                                  ? 'hover:bg-white/10 text-white'
                                  : 'hover:bg-gray-100 text-gray-900'
                            }`}
                          >
                            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
                              <span className="text-white text-sm font-bold">
                                {voice.name.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium">{voice.name}</div>
                              <div className={`text-xs capitalize ${
                                darkMode ? 'text-gray-400' : 'text-gray-600'
                              }`}>
                                {voice.gender} • {voice.accent}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Speed Control */}
                <div>
                  <label className={`block text-sm font-medium mb-3 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Reading Speed: {speed.toFixed(1)}x
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="2.0"
                    step="0.1"
                    value={speed}
                    onChange={(e) => setSpeed(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-2">
                    <span>0.5x (Slow)</span>
                    <span>1.0x (Normal)</span>
                    <span>2.0x (Fast)</span>
                  </div>
                </div>

                {/* Volume Control */}
                <div>
                  <label className={`block text-sm font-medium mb-3 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Volume: {Math.round(volume * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
              </div>

              {/* Info Panel */}
              <div className={`mt-6 p-4 rounded-xl border ${
                darkMode 
                  ? 'bg-blue-500/10 border-blue-500/20 text-blue-300' 
                  : 'bg-blue-50 border-blue-200 text-blue-700'
              }`}>
                <div className="flex items-start space-x-3">
                  <Zap className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <div className="font-medium mb-2">How it works:</div>
                    <ul className="space-y-1 text-xs">
                      <li>• <strong>Headers:</strong> Reads all page headings in order</li>
                      <li>• <strong>Content:</strong> Reads main article content</li>
                      <li>• Uses high-quality AI voice synthesis</li>
                      <li>• Automatically handles long content</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Error Display */}
      {error && (
        <div className={`absolute top-full left-0 right-0 mt-3 p-4 rounded-xl border ${
          darkMode 
            ? 'bg-red-500/10 border-red-500/20 text-red-300' 
            : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          <div className="text-sm">
            <div className="font-medium mb-1">Error:</div>
            <div>{error}</div>
          </div>
        </div>
      )}

      {/* Custom Slider Styles */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 18px;
          width: 18px;
          border-radius: 50%;
          background: linear-gradient(to right, #3b82f6, #8b5cf6);
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
          border: 2px solid white;
        }
        
        .slider::-moz-range-thumb {
          height: 18px;
          width: 18px;
          border-radius: 50%;
          background: linear-gradient(to right, #3b82f6, #8b5cf6);
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        }

        .slider::-webkit-slider-track {
          height: 8px;
          border-radius: 4px;
          background: #e5e7eb;
        }

        .slider::-moz-range-track {
          height: 8px;
          border-radius: 4px;
          background: #e5e7eb;
        }
      `}</style>
    </div>
  );
};