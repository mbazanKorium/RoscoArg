// src/hooks/useLunfardoWords.ts
import { useState, useCallback } from 'react';
import { AIWordResponse } from '../models/AIWord';
import { generateLunfardoWords } from '../services/openAIService';

/**
 * Fetches a full “rosco” (27 words) from OpenAI.
 * Returns { words, loading, error, fetchWords }.
 */
export function useLunfardoWords() {
  const [words, setWords]   = useState<AIWordResponse| null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const fetchWords = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await generateLunfardoWords();
      setWords(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { words, loading, error, fetchWords };
}
