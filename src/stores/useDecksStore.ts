import {create} from 'zustand';
import {IDeck} from '../types/deck.types';
import {deckService} from '../services/deck.service';

interface DecksState {
  decks: IDeck[];
  isLoading: boolean;
  error: string | null;
  hasInitialized: boolean;

  // Actions
  getAllDecks: () => Promise<void>;
  getDeckById: (id: string) => Promise<IDeck | undefined>;
  createDeck: (deck: IDeck) => Promise<string>;
  updateDeck: (id: string, updates: Partial<Omit<IDeck, 'id'>>) => Promise<void>;
  deleteDeck: (id: string) => Promise<void>;
  searchDecks: (query: string) => Promise<IDeck[]>;
  clearError: () => void;
}

export const useDecksStore = create<DecksState>((set, _get) => ({
  decks: [],
  isLoading: false,
  error: null,
  hasInitialized: false,

  getAllDecks: async () => {
    set({ isLoading: true, error: null });
    try {
      const decks = await deckService.getAllDecks();
      set({ decks, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch decks',
        isLoading: false,
      });
    }
  },

  getDeckById: async (id: string): Promise<IDeck | undefined> => {
    try {
      return await deckService.getDeckById(id);
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to get deck',
      });
      return undefined;
    }
  },

  createDeck: async (deck: IDeck): Promise<string> => {
    set({ isLoading: true, error: null });
    try {
      const id = await deckService.createDeck(deck);
      // Refresh decks list
      const decks = await deckService.getAllDecks();
      set({ decks, isLoading: false });
      return id;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to create deck',
        isLoading: false,
      });
      throw error;
    }
  },

  updateDeck: async (id: string, updates: Partial<Omit<IDeck, 'id'>>) => {
    set({ isLoading: true, error: null });
    try {
      await deckService.updateDeck(id, updates);
      // Refresh decks list
      const decks = await deckService.getAllDecks();
      set({ decks, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update deck',
        isLoading: false,
      });
      throw error;
    }
  },

  deleteDeck: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await deckService.deleteDeck(id);
      // Refresh decks list
      const decks = await deckService.getAllDecks();
      set({ decks, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete deck',
        isLoading: false,
      });
      throw error;
    }
  },

  searchDecks: async (query: string): Promise<IDeck[]> => {
    try {
      return await deckService.searchDecks(query);
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to search decks',
      });
      return [];
    }
  },

  clearError: () => set({ error: null }),
}));
