import { create } from 'zustand';
import { Deck } from '../types/deck.types';
import { deckService } from '../services/deck.service';

interface DecksState {
  decks: Deck[];
  currentDeck: Deck | null;
  isLoading: boolean;
  error: string | null;
  hasInitialized: boolean;

  // Actions
  getAllDecks: () => Promise<void>;
  getDeckById: (id: string) => Promise<Deck | undefined>;
  getDefaultDeck: () => Promise<void>;
  setCurrentDeck: (deck: Deck) => void;
  createDeck: (deck: Deck) => Promise<string>;
  updateDeck: (id: string, updates: Partial<Omit<Deck, 'id'>>) => Promise<void>;
  deleteDeck: (id: string) => Promise<void>;
  searchDecks: (query: string) => Promise<Deck[]>;
  initializeDecks: () => Promise<void>;
  clearError: () => void;
}

export const useDecksStore = create<DecksState>((set, get) => ({
  decks: [],
  currentDeck: null,
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

  getDeckById: async (id: string): Promise<Deck | undefined> => {
    try {
      return await deckService.getDeckById(id);
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to get deck',
      });
      return undefined;
    }
  },

  getDefaultDeck: async () => {
    set({ isLoading: true, error: null });
    try {
      const defaultDeck = await deckService.getDefaultDeck();
      set({
        currentDeck: defaultDeck,
        isLoading: false,
        hasInitialized: true,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to get default deck',
        isLoading: false,
        hasInitialized: true,
      });
    }
  },

  setCurrentDeck: (deck: Deck) => {
    set({ currentDeck: deck });
  },

  createDeck: async (deck: Deck): Promise<string> => {
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

  updateDeck: async (id: string, updates: Partial<Omit<Deck, 'id'>>) => {
    set({ isLoading: true, error: null });
    try {
      await deckService.updateDeck(id, updates);
      // Refresh decks list
      const decks = await deckService.getAllDecks();
      set({ decks, isLoading: false });

      // Update current deck if it's the one being updated
      const { currentDeck } = get();
      if (currentDeck && currentDeck.id === id) {
        const updatedDeck = await deckService.getDeckById(id);
        if (updatedDeck) {
          set({ currentDeck: updatedDeck });
        }
      }
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

      // Clear current deck if it's the one being deleted
      const { currentDeck } = get();
      if (currentDeck && currentDeck.id === id) {
        set({ currentDeck: null });
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete deck',
        isLoading: false,
      });
      throw error;
    }
  },

  searchDecks: async (query: string): Promise<Deck[]> => {
    try {
      return await deckService.searchDecks(query);
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to search decks',
      });
      return [];
    }
  },

  initializeDecks: async () => {
    const { hasInitialized, isLoading } = get();

    // Only initialize if we haven't already and we're not currently loading
    if (!hasInitialized && !isLoading) {
      set({ isLoading: true, error: null });
      try {
        // Get the default deck and set it as current
        const defaultDeck = await deckService.getDefaultDeck();
        // Also get all decks
        const allDecks = await deckService.getAllDecks();

        set({
          currentDeck: defaultDeck,
          decks: allDecks,
          isLoading: false,
          hasInitialized: true,
        });
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Failed to initialize decks',
          isLoading: false,
          hasInitialized: true, // Mark as initialized even on error to prevent retries
        });
      }
    }
  },

  clearError: () => set({ error: null }),
}));
