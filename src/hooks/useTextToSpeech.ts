import { useState, useCallback, useEffect } from 'react';
import { ttsService, TTSOptions, AVAILABLE_VOICES } from '../services/textToSpeech';

export interface UseTTSReturn {
  isPlaying: boolean;
  isPaused: boolean;
  isLoading: boolean;
  error: string | null;
  currentVoice: string;
  volume: number;
  speed: number;
  availableVoices: typeof AVAILABLE_VOICES;
  speak: (text: string) => Promise<void>;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  setVoice: (voiceId: string) => void;
  setVolume: (volume: number) => void;
  setSpeed: (speed: number) => void;
  readHeaders: () => Promise<void>;
  readPageContent: () => Promise<void>;
}

export const useTextToSpeech = (): UseTTSReturn => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentVoice, setCurrentVoice] = useState('EXAVITQu4vr4xnSDxMaL'); // Default to Bella
  const [volume, setVolumeState] = useState(0.8);
  const [speed, setSpeedState] = useState(1.0);

  // Update playback state from service
  useEffect(() => {
    const interval = setInterval(() => {
      const state = ttsService.getPlaybackState();
      setIsPlaying(state.isPlaying);
      setIsPaused(state.isPaused);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Load saved preferences
  useEffect(() => {
    const savedVoice = localStorage.getItem('tts-voice');
    const savedVolume = localStorage.getItem('tts-volume');
    const savedSpeed = localStorage.getItem('tts-speed');

    if (savedVoice) setCurrentVoice(savedVoice);
    if (savedVolume) setVolumeState(parseFloat(savedVolume));
    if (savedSpeed) setSpeedState(parseFloat(savedSpeed));
  }, []);

  const speak = useCallback(async (text: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const options: TTSOptions = {
        voice: currentVoice,
        speed,
        volume
      };

      const result = await ttsService.synthesizeSpeech(text, options);
      
      if (!result.success) {
        throw new Error(result.error || 'Speech synthesis failed');
      }

      if (result.audioUrl) {
        await ttsService.playAudio(result.audioUrl);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('TTS Error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentVoice, speed, volume]);

  const pause = useCallback(() => {
    ttsService.pause();
    setError(null);
  }, []);

  const resume = useCallback(() => {
    ttsService.resume();
    setError(null);
  }, []);

  const stop = useCallback(() => {
    ttsService.stop();
    setError(null);
  }, []);

  const setVoice = useCallback((voiceId: string) => {
    setCurrentVoice(voiceId);
    localStorage.setItem('tts-voice', voiceId);
  }, []);

  const setVolume = useCallback((newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolumeState(clampedVolume);
    ttsService.setVolume(clampedVolume);
    localStorage.setItem('tts-volume', clampedVolume.toString());
  }, []);

  const setSpeed = useCallback((newSpeed: number) => {
    const clampedSpeed = Math.max(0.5, Math.min(2.0, newSpeed));
    setSpeedState(clampedSpeed);
    localStorage.setItem('tts-speed', clampedSpeed.toString());
  }, []);

  const readHeaders = useCallback(async () => {
    try {
      setError(null);
      
      // Extract headings from the page
      const headings = ttsService.extractHeadingsFromPage();
      
      if (headings.length === 0) {
        throw new Error('No headings found on this page');
      }

      // Create a natural narrative from the headings
      const narrative = ttsService.createHeadingNarrative(headings);
      
      await speak(narrative);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to read headers';
      setError(errorMessage);
    }
  }, [speak]);

  const readPageContent = useCallback(async () => {
    try {
      setError(null);
      
      // Extract main content from the page
      const contentSelectors = [
        'main',
        'article',
        '.content',
        '.post-content',
        '.article-content',
        '.entry-content',
        '[role="main"]'
      ];

      let content = '';
      for (const selector of contentSelectors) {
        const element = document.querySelector(selector);
        if (element) {
          // Remove unwanted elements
          const clone = element.cloneNode(true) as Element;
          const unwanted = clone.querySelectorAll('script, style, nav, header, footer, .ad, .advertisement, .menu, .sidebar, .social-share, .comments');
          unwanted.forEach(el => el.remove());
          
          content = clone.textContent || '';
          if (content.length > 200) break; // Found substantial content
        }
      }

      if (!content || content.length < 50) {
        throw new Error('No substantial content found on this page');
      }

      // Limit content length for better TTS experience
      if (content.length > 5000) {
        content = content.substring(0, 5000) + '... Content truncated for speech synthesis.';
      }

      await speak(content);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to read page content';
      setError(errorMessage);
    }
  }, [speak]);

  return {
    isPlaying,
    isPaused,
    isLoading,
    error,
    currentVoice,
    volume,
    speed,
    availableVoices: AVAILABLE_VOICES,
    speak,
    pause,
    resume,
    stop,
    setVoice,
    setVolume,
    setSpeed,
    readHeaders,
    readPageContent
  };
};