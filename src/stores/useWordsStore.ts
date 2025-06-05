import { create } from 'zustand';
import { WordPair, WordPairList } from '../types/word.types';
import { wordPairService } from '../services/word-pair.service.ts';
import { useDecksStore } from './useDecksStore';

interface WordsState {
  words: WordPairList;
  isLoading: boolean;
  error: string | null;
  hasInitialized: boolean;
  fetchWords: (deckId?: string) => Promise<void>;
  initializeWords: (deckId?: string) => Promise<void>;
  saveWords: (newWords: WordPair[], deckId?: string) => Promise<void>;
  loadWordsFromDB: (deckId?: string) => Promise<void>;
  clearStoredWords: (deckId?: string) => Promise<void>;
  clearWords: () => void;
  getStoredWordsCount: (deckId?: string) => Promise<number>;
  searchWords: (query: string, deckId?: string) => Promise<WordPairList>;
  clearError: () => void;
}

export const useWordsStore = create<WordsState>((set, get) => ({
  words: [],
  isLoading: false,
  error: null,
  hasInitialized: false,

  fetchWords: async (deckId?: string) => {
    set({ isLoading: true, error: null });
    try {
      const words = await wordPairService.getDefaultWordPairs(deckId);
      set({ words, isLoading: false, hasInitialized: true });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch words',
        isLoading: false,
      });
    }
  },

  initializeWords: async (deckId?: string) => {
    const { isLoading } = get();

    // Don't initialize if already loading
    if (isLoading) {
      return;
    }

    set({ isLoading: true, error: null });
    try {
      // If no deckId provided, get current deck from deck store
      let targetDeckId = deckId;
      if (!targetDeckId) {
        const deckStore = useDecksStore.getState();
        if (!deckStore.currentDeck) {
          // Initialize deck store first if needed
          await deckStore.initializeDecks();
        }
        targetDeckId = deckStore.currentDeck?.id;
      }

      if (!targetDeckId) {
        throw new Error('No deck ID available for word initialization');
      }

      // Use the new initialize method that handles IndexedDB
      const words = await wordPairService.initializeWordPairs(targetDeckId);
      set({ words, isLoading: false, hasInitialized: true });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load initial words',
        isLoading: false,
        hasInitialized: true, // Mark as initialized even on error to prevent retries
      });
    }
  },

  saveWords: async (newWords: WordPair[], deckId?: string) => {
    set({ isLoading: true, error: null });
    try {
      // If no deckId provided, get current deck from deck store
      let targetDeckId = deckId;
      if (!targetDeckId) {
        const deckStore = useDecksStore.getState();
        targetDeckId = deckStore.currentDeck?.id;
      }

      // Save to IndexedDB
      await wordPairService.saveWordPairs(newWords, targetDeckId);
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

  loadWordsFromDB: async (deckId?: string) => {
    set({ isLoading: true, error: null });
    try {
      // If no deckId provided, get current deck from deck store
      let targetDeckId = deckId;
      if (!targetDeckId) {
        const deckStore = useDecksStore.getState();
        targetDeckId = deckStore.currentDeck?.id;
      }

      const words = await wordPairService.loadWordPairs(targetDeckId);
      set({ words, isLoading: false, hasInitialized: true });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load words from storage',
        isLoading: false,
      });
      throw error;
    }
  },

  clearStoredWords: async (deckId?: string) => {
    set({ isLoading: true, error: null });
    try {
      // If no deckId provided, get current deck from deck store
      let targetDeckId = deckId;
      if (!targetDeckId) {
        const deckStore = useDecksStore.getState();
        targetDeckId = deckStore.currentDeck?.id;
      }

      await wordPairService.clearStoredWordPairs(targetDeckId);
      set({ words: [], isLoading: false, hasInitialized: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to clear stored words',
        isLoading: false,
      });
      throw error;
    }
  },

  getStoredWordsCount: async (deckId?: string): Promise<number> => {
    try {
      // If no deckId provided, get current deck from deck store
      let targetDeckId = deckId;
      if (!targetDeckId) {
        const deckStore = useDecksStore.getState();
        targetDeckId = deckStore.currentDeck?.id;
      }

      return await wordPairService.getStoredWordPairsCount(targetDeckId);
    } catch (error) {
      console.error('Failed to get stored words count:', error);
      return 0;
    }
  },

  searchWords: async (query: string, deckId?: string): Promise<WordPairList> => {
    try {
      // If no deckId provided, get current deck from deck store
      let targetDeckId = deckId;
      if (!targetDeckId) {
        const deckStore = useDecksStore.getState();
        targetDeckId = deckStore.currentDeck?.id;
      }

      return await wordPairService.searchStoredWordPairs(query, targetDeckId);
    } catch (error) {
      console.error('Failed to search words:', error);
      throw error;
    }
  },

  clearError: () => set({ error: null }),

  clearWords: () => set({ words: [] }),
}));
