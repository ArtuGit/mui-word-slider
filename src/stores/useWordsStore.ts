import { create } from 'zustand';
import { WordPair, WordPairList } from '../types/word.types';
import { api } from '../services/api.service';

interface WordsState {
  words: WordPairList;
  isLoading: boolean;
  error: string | null;
  fetchWords: () => Promise<void>;
  saveWords: (newWords: WordPair[]) => void;
  clearError: () => void;
}

export const useWordsStore = create<WordsState>((set, _get) => ({
  words: [],
  isLoading: false,
  error: null,

  fetchWords: async () => {
    set({ isLoading: true, error: null });
    try {
      const words = await api.getWords();
      set({ words, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch words',
        isLoading: false,
      });
    }
  },

  saveWords: (newWords: WordPair[]) => {
    set({ words: newWords, error: null });
  },

  clearError: () => set({ error: null }),
}));
