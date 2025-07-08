import { HfInference } from '@huggingface/inference';

export interface Emotion {
  label: string;
  score: number;
}

export interface EmotionAnalysisResult {
  emotions: Emotion[];
  error?: string;
  rawResponse?: any; // For debugging
}

// Model recommended for multi-label emotion classification
const DEFAULT_EMOTION_MODEL = 'SamLowe/roberta-base-go_emotions';

const getHuggingFaceApiKey = (): string | null => {
  return localStorage.getItem('huggingFaceApiKey');
};

export const analyzeEmotionalIntensity = async (text: string): Promise<EmotionAnalysisResult> => {
  const apiKey = getHuggingFaceApiKey();

  if (!apiKey) {
    return { emotions: [], error: 'Hugging Face API key not found in localStorage.' };
  }

  const hf = new HfInference(apiKey);

  try {
    const response = await hf.textClassification({
      model: DEFAULT_EMOTION_MODEL,
      inputs: text,
    });

    // The response is an array of arrays of Emotion objects if the model returns multiple emotions.
    // For SamLowe/roberta-base-go_emotions, it should be in the format:
    // [
    //   { label: 'admiration', score: 0.99 },
    //   { label: 'neutral', score: 0.005 }
    //   ...
    // ]
    // Or it could be nested if multiple inputs were provided (not our case here for a single text)
    // We expect a flat array of emotions for a single input string.

    if (Array.isArray(response) && response.length > 0) {
      // Check if the first element is also an array (unexpected for single input)
      if (Array.isArray(response[0])) {
         // This case might happen if the API interprets a single string as a batch of one.
         // Let's assume the actual emotion scores are in the first element of the outer array.
        const emotions = response[0] as Emotion[];
        return { emotions, rawResponse: response };
      }
      // If it's a flat array of emotions
      const emotions = response as Emotion[];
      return { emotions, rawResponse: response };

    } else {
      console.warn('Unexpected response format from Hugging Face API:', response);
      return { emotions: [], error: 'Unexpected response format from emotional analysis API.', rawResponse: response };
    }

  } catch (error: any) {
    console.error('Error analyzing emotional intensity with Hugging Face API:', error);
    let errorMessage = 'Failed to analyze emotional intensity.';
    if (error.message) {
      errorMessage += ` Details: ${error.message}`;
    }
    // Check for specific HF error messages if available
    if (error.response && error.response.data && error.response.data.error) {
        errorMessage = `Hugging Face API Error: ${error.response.data.error}`;
    } else if (error.message && error.message.includes('401')) {
        errorMessage = 'Hugging Face API Error: Unauthorized. Check your API token.';
    }
    return { emotions: [], error: errorMessage, rawResponse: error };
  }
};

// Helper function to derive a single emotional intensity score from the list of emotions
// This is a simple approach, could be made more sophisticated
export const deriveOverallEmotionalScore = (emotions: Emotion[]): number => {
  if (!emotions || emotions.length === 0) {
    return 0;
  }

  // Filter out 'neutral' or similar low-impact emotions if desired
  const significantEmotions = emotions.filter(
    e => e.label.toLowerCase() !== 'neutral' && e.label.toLowerCase() !== 'realization' && e.label.toLowerCase() !== 'optimism'
  );

  if (significantEmotions.length === 0) {
    // If only neutral/low-impact emotions, consider intensity low
    // Or find the actual neutral score if available
    const neutralEmotion = emotions.find(e => e.label.toLowerCase() === 'neutral');
    if (neutralEmotion && neutralEmotion.score > 0.5) return 0; // strong neutral
    return 1; // default low if only minor non-neutral
  }

  // Use the highest score among significant emotions
  let maxScore = 0;
  significantEmotions.forEach(emotion => {
    if (emotion.score > maxScore) {
      maxScore = emotion.score;
    }
  });

  // Scale to 0-10
  return Math.min(Math.round(maxScore * 10), 10);
};

// Example of how specific emotions could be weighted for an "emotional language" score
export const calculateWeightedEmotionalScore = (emotions: Emotion[], weights: Record<string, number> = {}): number => {
  if (!emotions || emotions.length === 0) return 0;

  const defaultWeight = 1;
  // Example weights: negative emotions might contribute more to "intensity"
  const emotionWeights: Record<string, number> = {
    anger: 1.5,
    fear: 1.3,
    sadness: 1.2,
    disgust: 1.4,
    joy: 1.0,
    surprise: 0.8,
    // Add more as per model's output labels
    ...weights
  };

  let weightedScoreSum = 0;
  let totalWeightApplied = 0;

  emotions.forEach(emotion => {
    const weight = emotionWeights[emotion.label.toLowerCase()] || defaultWeight;
    // We only consider emotions with a score above a certain threshold to avoid noise
    if (emotion.score > 0.1) {
      weightedScoreSum += emotion.score * weight;
      totalWeightApplied += weight; // This normalization might not be ideal, consider max possible score
    }
  });

  // This is a simplistic normalization. Could be improved.
  // Aiming for a 0-10 score. If max possible weighted score is known, that's better.
  // For now, let's assume an average emotion score, then scale.
  if (totalWeightApplied === 0) return 0;

  // Let's cap the sum of scores contributing to the average at 1 (max score for one emotion)
  // and then scale by the highest possible weight if that makes sense, or just scale the average.
  // This part needs refinement based on typical model output.
  // For now, let's try a simpler approach: sum of (score * weight), then scale.

  let rawWeightedScore = 0;
  emotions.forEach(emotion => {
    const weight = emotionWeights[emotion.label.toLowerCase()] || defaultWeight;
    rawWeightedScore += emotion.score * weight;
  });

  // Heuristic scaling: Assuming rawWeightedScore might range from 0 to ~5 (e.g. multiple high-score emotions with weights)
  // This needs calibration based on typical model output
  const scaledScore = Math.min(rawWeightedScore * 2, 10);

  return parseFloat(scaledScore.toFixed(1));
};
