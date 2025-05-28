import { create } from 'zustand';
import { WordPair, WordPairList } from '../types/word.types';
import { wordPairService } from '../services/word-pair.service.ts';

interface WordsState {
  words: WordPairList;
  isLoading: boolean;
  error: string | null;
  hasInitialized: boolean;
  fetchWords: () => Promise<void>;
  initializeWords: () => Promise<void>;
  saveWords: (newWords: WordPair[]) => Promise<void>;
  loadWordsFromDB: () => Promise<void>;
  clearStoredWords: () => Promise<void>;
  getStoredWordsCount: () => Promise<number>;
  searchWords: (query: string) => Promise<WordPairList>;
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
      const words = await wordPairService.getDefaultWordPairs();
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
        // Use the new initialize method that handles IndexedDB
        const words = await wordPairService.initializeWordPairs();
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

  saveWords: async (newWords: WordPair[]) => {
    set({ isLoading: true, error: null });
    try {
      // Save to IndexedDB
      await wordPairService.saveWordPairs(newWords);
      // Update store state
      set({ words: newWords, error: null, hasInitialized: true, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to save words',
        isLoading: false,
      });
      throw error; // Re-throw so UI can handle the error
    }
  },

  loadWordsFromDB: async () => {
    set({ isLoading: true, error: null });
    try {
      const words = await wordPairService.loadWordPairs();
      set({ words, isLoading: false, hasInitialized: true });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load words from storage',
        isLoading: false,
      });
      throw error;
    }
  },

  clearStoredWords: async () => {
    set({ isLoading: true, error: null });
    try {
      await wordPairService.clearStoredWordPairs();
      set({ words: [], isLoading: false, hasInitialized: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to clear stored words',
        isLoading: false,
      });
      throw error;
    }
  },

  getStoredWordsCount: async (): Promise<number> => {
    try {
      return await wordPairService.getStoredWordPairsCount();
    } catch (error) {
      console.error('Failed to get stored words count:', error);
      return 0;
    }
  },

  searchWords: async (query: string): Promise<WordPairList> => {
    try {
      return await wordPairService.searchStoredWordPairs(query);
    } catch (error) {
      console.error('Failed to search words:', error);
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
