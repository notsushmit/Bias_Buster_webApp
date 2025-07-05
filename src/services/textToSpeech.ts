import axios from 'axios';

export interface TTSOptions {
  voice?: string;
  speed?: number;
  pitch?: number;
  volume?: number;
}

export interface TTSResponse {
  success: boolean;
  audioUrl?: string;
  error?: string;
}

const TTS_API_KEY = 'ap2_65657be6-38e9-40a2-aa90-920efd4e51ba';
const TTS_API_BASE_URL = 'https://api.elevenlabs.io/v1';

// Available voices with more options
export const AVAILABLE_VOICES = [
  { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Bella', gender: 'female', accent: 'american' },
  { id: 'ErXwobaYiN019PkySvjV', name: 'Antoni', gender: 'male', accent: 'american' },
  { id: 'VR6AewLTigWG4xSOukaG', name: 'Arnold', gender: 'male', accent: 'american' },
  { id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam', gender: 'male', accent: 'american' },
  { id: 'yoZ06aMxZJJ28mfd3POQ', name: 'Sam', gender: 'male', accent: 'american' },
  { id: 'AZnzlk1XvdvUeBnXmlld', name: 'Domi', gender: 'female', accent: 'american' },
  { id: 'CYw3kZ02Hs0563khs1Fj', name: 'Dave', gender: 'male', accent: 'british' },
  { id: 'FGY2WhTYpPnrIDTdsKH5', name: 'Laura', gender: 'female', accent: 'american' },
];

export class TextToSpeechService {
  private currentAudio: HTMLAudioElement | null = null;
  private isPlaying: boolean = false;
  private isPaused: boolean = false;
  private currentVolume: number = 0.8;
  private audioQueue: string[] = [];
  private isProcessingQueue: boolean = false;

  async synthesizeSpeech(text: string, options: TTSOptions = {}): Promise<TTSResponse> {
    try {
      const {
        voice = 'EXAVITQu4vr4xnSDxMaL', // Default to Bella
        speed = 1.0,
        volume = 0.8
      } = options;

      // Clean and prepare text for TTS
      const cleanText = this.cleanTextForTTS(text);
      
      if (!cleanText.trim()) {
        return { success: false, error: 'No text to synthesize' };
      }

      // Split long text into chunks to avoid API limits
      const textChunks = this.splitTextIntoChunks(cleanText, 2500);
      
      if (textChunks.length === 1) {
        return await this.synthesizeChunk(textChunks[0], voice);
      } else {
        // For multiple chunks, we'll process them sequentially
        return await this.synthesizeMultipleChunks(textChunks, voice);
      }
    } catch (error) {
      console.error('TTS API Error:', error);
      return this.fallbackToWebSpeechAPI(text, options);
    }
  }

  private async synthesizeChunk(text: string, voiceId: string): Promise<TTSResponse> {
    try {
      const response = await axios.post(
        `${TTS_API_BASE_URL}/text-to-speech/${voiceId}`,
        {
          text: text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.0,
            use_speaker_boost: true
          }
        },
        {
          headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': TTS_API_KEY
          },
          responseType: 'blob',
          timeout: 30000 // 30 second timeout
        }
      );

      // Create audio URL from blob
      const audioBlob = new Blob([response.data], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);

      return { success: true, audioUrl };
    } catch (error) {
      console.error('Error synthesizing chunk:', error);
      throw error;
    }
  }

  private async synthesizeMultipleChunks(chunks: string[], voiceId: string): Promise<TTSResponse> {
    try {
      const audioUrls: string[] = [];
      
      for (const chunk of chunks) {
        const result = await this.synthesizeChunk(chunk, voiceId);
        if (result.success && result.audioUrl) {
          audioUrls.push(result.audioUrl);
        } else {
          throw new Error('Failed to synthesize chunk');
        }
      }

      // Combine audio chunks (for now, we'll just play them sequentially)
      this.audioQueue = audioUrls;
      return { success: true, audioUrl: audioUrls[0] };
    } catch (error) {
      console.error('Error synthesizing multiple chunks:', error);
      throw error;
    }
  }

  private splitTextIntoChunks(text: string, maxLength: number): string[] {
    if (text.length <= maxLength) {
      return [text];
    }

    const chunks: string[] = [];
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    let currentChunk = '';

    for (const sentence of sentences) {
      const trimmedSentence = sentence.trim();
      if (currentChunk.length + trimmedSentence.length + 1 <= maxLength) {
        currentChunk += (currentChunk ? '. ' : '') + trimmedSentence;
      } else {
        if (currentChunk) {
          chunks.push(currentChunk + '.');
        }
        currentChunk = trimmedSentence;
      }
    }

    if (currentChunk) {
      chunks.push(currentChunk + '.');
    }

    return chunks;
  }

  private fallbackToWebSpeechAPI(text: string, options: TTSOptions): TTSResponse {
    try {
      if (!('speechSynthesis' in window)) {
        return { success: false, error: 'Speech synthesis not supported in this browser' };
      }

      const utterance = new SpeechSynthesisUtterance(this.cleanTextForTTS(text));
      utterance.rate = options.speed || 1.0;
      utterance.pitch = options.pitch || 1.0;
      utterance.volume = options.volume || 0.8;

      // Try to find a voice that matches the requested voice
      const voices = speechSynthesis.getVoices();
      const selectedVoice = voices.find(voice => 
        voice.name.toLowerCase().includes('english') || 
        voice.lang.includes('en')
      ) || voices[0];

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      utterance.onstart = () => {
        this.isPlaying = true;
        this.isPaused = false;
      };

      utterance.onend = () => {
        this.isPlaying = false;
        this.isPaused = false;
      };

      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        this.isPlaying = false;
        this.isPaused = false;
      };

      speechSynthesis.speak(utterance);
      return { success: true };
    } catch (error) {
      console.error('Web Speech API Error:', error);
      return { success: false, error: 'Speech synthesis failed' };
    }
  }

  private cleanTextForTTS(text: string): string {
    return text
      .replace(/[^\w\s.,!?;:\-()]/g, '') // Remove special characters except basic punctuation
      .replace(/\s+/g, ' ') // Normalize whitespace
      .replace(/([.!?])\s*([A-Z])/g, '$1 $2') // Ensure proper spacing after sentences
      .trim();
  }

  async playAudio(audioUrl: string): Promise<void> {
    try {
      if (this.currentAudio) {
        this.currentAudio.pause();
        this.currentAudio = null;
      }

      this.currentAudio = new Audio(audioUrl);
      this.currentAudio.volume = this.currentVolume;
      
      this.currentAudio.addEventListener('ended', () => {
        this.handleAudioEnded();
      });

      this.currentAudio.addEventListener('error', (e) => {
        console.error('Audio playback error:', e);
        this.isPlaying = false;
        this.isPaused = false;
      });

      this.currentAudio.addEventListener('loadstart', () => {
        console.log('Audio loading started');
      });

      this.currentAudio.addEventListener('canplay', () => {
        console.log('Audio can start playing');
      });

      await this.currentAudio.play();
      this.isPlaying = true;
      this.isPaused = false;
    } catch (error) {
      console.error('Error playing audio:', error);
      throw error;
    }
  }

  private handleAudioEnded(): void {
    // Clean up current audio URL
    if (this.currentAudio?.src) {
      URL.revokeObjectURL(this.currentAudio.src);
    }

    // Check if there are more audio chunks in the queue
    if (this.audioQueue.length > 1) {
      this.audioQueue.shift(); // Remove the completed chunk
      this.playAudio(this.audioQueue[0]); // Play next chunk
    } else {
      this.isPlaying = false;
      this.isPaused = false;
      this.audioQueue = [];
    }
  }

  pause(): void {
    if (this.currentAudio && this.isPlaying) {
      this.currentAudio.pause();
      this.isPaused = true;
      this.isPlaying = false;
    }

    // Pause web speech synthesis if it's running
    if ('speechSynthesis' in window && speechSynthesis.speaking) {
      speechSynthesis.pause();
      this.isPaused = true;
      this.isPlaying = false;
    }
  }

  resume(): void {
    if (this.currentAudio && this.isPaused) {
      this.currentAudio.play();
      this.isPaused = false;
      this.isPlaying = true;
    }

    // Resume web speech synthesis if it's paused
    if ('speechSynthesis' in window && speechSynthesis.paused) {
      speechSynthesis.resume();
      this.isPaused = false;
      this.isPlaying = true;
    }
  }

  stop(): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      if (this.currentAudio.src) {
        URL.revokeObjectURL(this.currentAudio.src);
      }
      this.currentAudio = null;
    }
    
    // Stop web speech synthesis if it's running
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }

    // Clean up audio queue
    this.audioQueue.forEach(url => URL.revokeObjectURL(url));
    this.audioQueue = [];
    
    this.isPlaying = false;
    this.isPaused = false;
  }

  getPlaybackState(): { isPlaying: boolean; isPaused: boolean } {
    return {
      isPlaying: this.isPlaying,
      isPaused: this.isPaused
    };
  }

  setVolume(volume: number): void {
    this.currentVolume = Math.max(0, Math.min(1, volume));
    if (this.currentAudio) {
      this.currentAudio.volume = this.currentVolume;
    }
  }

  // Enhanced method to extract and read all headings with better content processing
  extractHeadingsFromPage(): { text: string; level: number; element: Element }[] {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const headingData: { text: string; level: number; element: Element }[] = [];

    headings.forEach((heading) => {
      const text = heading.textContent?.trim();
      const level = parseInt(heading.tagName.charAt(1));
      
      if (text && text.length > 0) {
        // Filter out navigation and UI headings
        const isContentHeading = !heading.closest('nav, header, footer, .menu, .sidebar, .navigation');
        if (isContentHeading) {
          headingData.push({ text, level, element: heading });
        }
      }
    });

    return headingData;
  }

  // Create a natural reading flow for headings
  createHeadingNarrative(headings: { text: string; level: number }[]): string {
    if (headings.length === 0) {
      return 'No headings found on this page.';
    }

    let narrative = 'Here are the main headings on this page. ';
    
    headings.forEach((heading, index) => {
      const levelText = heading.level === 1 ? 'Main heading' : 
                       heading.level === 2 ? 'Section heading' : 
                       heading.level === 3 ? 'Subsection heading' : 
                       `Level ${heading.level} heading`;
      
      if (index === 0) {
        narrative += `${levelText}: ${heading.text}. `;
      } else if (index === headings.length - 1) {
        narrative += `And finally, ${levelText}: ${heading.text}.`;
      } else {
        narrative += `Next, ${levelText}: ${heading.text}. `;
      }
    });

    return narrative;
  }
}

// Singleton instance
export const ttsService = new TextToSpeechService();