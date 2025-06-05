import { Deck } from '../types/deck.types';
import { DeckIndexedDbProvider } from './deck.indexed-db-provider';

export const deckService = {
  /**
   * Get all decks
   */
  getAllDecks: async (): Promise<Deck[]> => {
    try {
      return await DeckIndexedDbProvider.getAllDecks();
    } catch (error) {
      console.error('Failed to get all decks:', error);
      throw error;
    }
  },

  /**
   * Get a deck by ID
   */
  getDeckById: async (id: string): Promise<Deck | undefined> => {
    try {
      return await DeckIndexedDbProvider.getDeckById(id);
    } catch (error) {
      console.error('Failed to get deck by ID:', error);
      throw error;
    }
  },

  /**
   * Get the default deck
   */
  getDefaultDeck: async (): Promise<Deck> => {
    try {
      return await DeckIndexedDbProvider.getDefaultDeck();
    } catch (error) {
      console.error('Failed to get default deck:', error);
      throw error;
    }
  },

  /**
   * Create a new deck
   */
  createDeck: async (deck: Deck): Promise<string> => {
    try {
      return await DeckIndexedDbProvider.saveDeck(deck);
    } catch (error) {
      console.error('Failed to create deck:', error);
      throw error;
    }
  },

  /**
   * Update an existing deck
   */
  updateDeck: async (id: string, updates: Partial<Omit<Deck, 'id'>>): Promise<number> => {
    try {
      return await DeckIndexedDbProvider.updateDeck(id, updates);
    } catch (error) {
      console.error('Failed to update deck:', error);
      throw error;
    }
  },

  /**
   * Delete a deck
   */
  deleteDeck: async (id: string): Promise<void> => {
    try {
      await DeckIndexedDbProvider.deleteDeck(id);
    } catch (error) {
      console.error('Failed to delete deck:', error);
      throw error;
    }
  },

  /**
   * Check if there are any decks stored
   */
  hasDecks: async (): Promise<boolean> => {
    try {
      return await DeckIndexedDbProvider.hasDecks();
    } catch (error) {
      console.error('Failed to check if decks exist:', error);
      return false;
    }
  },

  /**
   * Clear all decks
   */
  clearAllDecks: async (): Promise<void> => {
    try {
      await DeckIndexedDbProvider.clearAllDecks();
    } catch (error) {
      console.error('Failed to clear all decks:', error);
      throw error;
    }
  },

  /**
   * Get the count of decks
   */
  getDecksCount: async (): Promise<number> => {
    try {
      return await DeckIndexedDbProvider.getDecksCount();
    } catch (error) {
      console.error('Failed to get decks count:', error);
      return 0;
    }
  },

  /**
   * Search decks by query
   */
  searchDecks: async (query: string): Promise<Deck[]> => {
    try {
      return await DeckIndexedDbProvider.searchDecks(query);
    } catch (error) {
      console.error('Failed to search decks:', error);
      throw error;
    }
  },

  /**
   * Get default decks (creates default deck if none exist)
   */
  getDefaultDecks: async (): Promise<Deck[]> => {
    try {
      return await DeckIndexedDbProvider.getDefaultDecks();
    } catch (error) {
      console.error('Failed to get default decks:', error);
      throw error;
    }
  },

  /**
   * Initialize the deck system - ensures default deck exists, returns all decks
   */
  initializeDecks: async (): Promise<Deck[]> => {
    try {
      return await DeckIndexedDbProvider.getDefaultDecks();
    } catch (error) {
      console.error('Failed to initialize decks:', error);
      throw error;
    }
  },
};
