import { create } from 'zustand';
import { ICard, ICardList } from '../types/card.types.ts';
import { cardService } from '../services/card.service.ts';
import { useDecksStore } from './useDecksStore';

interface WordsState {
  words: ICardList;
  isLoading: boolean;
  error: string | null;
  hasInitialized: boolean;
  fetchCards: (deckId?: string) => Promise<void>;
  initializeCards: (deckId?: string) => Promise<void>;
  saveCards: (newWords: ICard[], deckId?: string) => Promise<void>;
  loadCardsFromDB: (deckId?: string) => Promise<void>;
  clearStoredCards: (deckId?: string) => Promise<void>;
  clearWords: () => void;
  getStoredCardsCount: (deckId?: string) => Promise<number>;
  searchCards: (query: string, deckId?: string) => Promise<ICardList>;
  clearError: () => void;
}

export const useCardsStore = create<WordsState>((set, get) => ({
  words: [],
  isLoading: false,
  error: null,
  hasInitialized: false,

  fetchCards: async (deckId?: string) => {
    set({ isLoading: true, error: null });
    try {
      const words = await cardService.getDefaultCards(deckId);
      set({ words, isLoading: false, hasInitialized: true });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch words',
        isLoading: false,
      });
    }
  },

  initializeCards: async (deckId?: string) => {
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
      const words = await cardService.initializeCards(targetDeckId);
      set({ words, isLoading: false, hasInitialized: true });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load initial words',
        isLoading: false,
        hasInitialized: true, // Mark as initialized even on error to prevent retries
      });
    }
  },

  saveCards: async (newWords: ICard[], deckId?: string) => {
    set({ isLoading: true, error: null });
    try {
      // If no deckId provided, get current deck from deck store
      let targetDeckId = deckId;
      if (!targetDeckId) {
        const deckStore = useDecksStore.getState();
        targetDeckId = deckStore.currentDeck?.id;
      }

      // Save to IndexedDB
      await cardService.saveCards(newWords, targetDeckId);
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

  loadCardsFromDB: async (deckId?: string) => {
    set({ isLoading: true, error: null });
    try {
      // If no deckId provided, get current deck from deck store
      let targetDeckId = deckId;
      if (!targetDeckId) {
        const deckStore = useDecksStore.getState();
        targetDeckId = deckStore.currentDeck?.id;
      }

      const words = await cardService.loadCards(targetDeckId);
      set({ words, isLoading: false, hasInitialized: true });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load words from storage',
        isLoading: false,
      });
      throw error;
    }
  },

  clearStoredCards: async (deckId?: string) => {
    set({ isLoading: true, error: null });
    try {
      // If no deckId provided, get current deck from deck store
      let targetDeckId = deckId;
      if (!targetDeckId) {
        const deckStore = useDecksStore.getState();
        targetDeckId = deckStore.currentDeck?.id;
      }

      await cardService.clearStoredCards(targetDeckId);
      set({ words: [], isLoading: false, hasInitialized: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to clear stored words',
        isLoading: false,
      });
      throw error;
    }
  },

  getStoredCardsCount: async (deckId?: string): Promise<number> => {
    try {
      // If no deckId provided, get current deck from deck store
      let targetDeckId = deckId;
      if (!targetDeckId) {
        const deckStore = useDecksStore.getState();
        targetDeckId = deckStore.currentDeck?.id;
      }

      return await cardService.getStoredCardsCount(targetDeckId);
    } catch (error) {
      console.error('Failed to get stored words count:', error);
      return 0;
    }
  },

  searchCards: async (query: string, deckId?: string): Promise<ICardList> => {
    try {
      // If no deckId provided, get current deck from deck store
      let targetDeckId = deckId;
      if (!targetDeckId) {
        const deckStore = useDecksStore.getState();
        targetDeckId = deckStore.currentDeck?.id;
      }

      return await cardService.searchStoredCards(query, targetDeckId);
    } catch (error) {
      console.error('Failed to search words:', error);
      throw error;
    }
  },

  clearError: () => set({ error: null }),

  clearWords: () => set({ words: [] }),
}));
