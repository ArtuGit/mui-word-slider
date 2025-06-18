import {create} from 'zustand';
import {ICard, ICardList} from '../types/card.types.ts';
import {cardService} from '../services/card.service.ts';

interface ICardsState {
  words: ICardList;
  isLoading: boolean;
  error: string | null;
  hasInitialized: boolean;

  // Actions
  saveCards: (cards: ICard[], deckId: string) => Promise<void>;
  deleteCards: (deckId: string) => Promise<void>;
  getCards: (deckId: string) => Promise<void>;
  clearWords: () => void;
  getCardsAmount: (deckId: string) => Promise<number>;
  searchCards: (query: string, deckId: string) => Promise<ICardList>;
  clearError: () => void;
}

export const useCardsStore = create<ICardsState>((set, _get) => ({
  words: [],
  isLoading: false,
  error: null,
  hasInitialized: false,

  saveCards: async (newWords: ICard[], deckId: string) => {
    set({ isLoading: true, error: null });
    try {
      await cardService.saveCards(newWords, deckId);
      set({ words: newWords, error: null, hasInitialized: true, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to save words',
        isLoading: false,
      });
      throw error;
    }
  },

  getCards: async (deckId: string) => {
    set({ isLoading: true, error: null });
    try {
      const words = await cardService.loadCards(deckId);
      set({ words, isLoading: false, hasInitialized: true });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load words from storage',
        isLoading: false,
      });
      throw error;
    }
  },

  deleteCards: async (deckId: string) => {
    set({isLoading: true, error: null});
    try {
      await cardService.clearCards(deckId);
      // Clear words from state if they belong to the deleted deck
      const currentWords = _get().words;
      const filteredWords = currentWords.filter(word => word.deckId !== deckId);
      set({words: filteredWords, isLoading: false});
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete cards',
        isLoading: false,
      });
      throw error;
    }
  },

  getCardsAmount: async (deckId: string): Promise<number> => {
    try {
      return await cardService.getStoredCardsCount(deckId);
    } catch (error) {
      console.error('Failed to get stored words count:', error);
      return 0;
    }
  },

  searchCards: async (query: string, deckId: string): Promise<ICardList> => {
    try {
      return await cardService.searchStoredCards(query, deckId);
    } catch (error) {
      console.error('Failed to search words:', error);
      throw error;
    }
  },

  clearError: () => set({ error: null }),

  clearWords: () => set({ words: [] }),
}));
