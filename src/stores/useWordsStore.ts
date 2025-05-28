import { create } from 'zustand';
import { WordPair, WordPairList } from '../types/word.types';
import { api } from '../services/api.service';

interface WordsState {
  words: WordPairList;
  isLoading: boolean;
  error: string | null;
  hasInitialized: boolean;
  fetchWords: () => Promise<void>;
  initializeWords: () => Promise<void>;
  saveWords: (newWords: WordPair[]) => void;
  clearError: () => void;
}

export const useWordsStore = create<WordsState>((set, get) => ({
  words: [],
  isLoading: false,
  error: null,
  hasInitialized: false,

  fetchWords: async () => {
    set({ isLoading: true, error: null });
    try {
      const words = await api.getWords();
      set({ words, isLoading: false, hasInitialized: true });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch words',
        isLoading: false,
      });
    }
  },

  initializeWords: async () => {
    const { words, hasInitialized, isLoading } = get();

    // Only initialize if we haven't already and we're not currently loading
    if (words.length === 0 && !hasInitialized && !isLoading) {
      set({ isLoading: true, error: null });
      try {
        const words = await api.getWords();
        set({ words, isLoading: false, hasInitialized: true });
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Failed to load initial words',
          isLoading: false,
          hasInitialized: true, // Mark as initialized even on error to prevent retries
        });
      }
    }
  },

  saveWords: (newWords: WordPair[]) => {
    set({ words: newWords, error: null, hasInitialized: true });
  },

  clearError: () => set({ error: null }),
}));
