import {IDeck, IDeckWithAmount} from '../types/deck.types';
import {DeckIndexedDbProvider} from './deck.indexed-db-provider';
import {INITIAL_DECKS} from '../constants/initial-data';
import {delay} from '../utils/time.utils.ts';

export const deckService = {
  /**
   * Get all decks
   */
  getAllDecks: async (): Promise<IDeckWithAmount[]> => {
    try {
      return await DeckIndexedDbProvider.getAllDecks();
    } catch (error) {
      console.error('Failed to get deck by ID:', error);
      throw error;
    }
  },

  /**
   * Get a deck by ID
   */
  getDeckById: async (id: string): Promise<IDeckWithAmount | undefined> => {
    try {
      await delay(Math.random() * 2000 + 500);
      return await DeckIndexedDbProvider.getDeckById(id);
    } catch (error) {
      console.error('Failed to get deck by ID:', error);
      throw error;
    }
  },

  /**
   * Get default decks (creates default decks if none exist)
   */
  getDefaultDecks: async (): Promise<IDeckWithAmount[]> => {
    try {
      // Simulate network delay between 500ms and 1500ms
      await delay(Math.random() * 1000 + 500);
      console.log('Fetching default decks...');

      const allDecks = await DeckIndexedDbProvider.getAllDecks();

      if (allDecks.length === 0) {
        // Create default decks if none exist
        for (const initialDeck of INITIAL_DECKS) {
          await DeckIndexedDbProvider.saveDeck(initialDeck);
        }
        // Return the created decks with calculated amounts
        return await DeckIndexedDbProvider.getAllDecks();
      }

      return allDecks;
    } catch (error) {
      console.error('Failed to get default decks:', error);
      throw error;
    }
  },

  /**
   * Create a new deck
   */
  createDeck: async (deck: IDeck): Promise<string> => {
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
  updateDeck: async (id: string, updates: Partial<Omit<IDeck, 'id'>>): Promise<number> => {
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
      await delay(Math.random() * 2000 + 500);
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
  searchDecks: async (query: string): Promise<IDeckWithAmount[]> => {
    try {
      return await DeckIndexedDbProvider.searchDecks(query);
    } catch (error) {
      console.error('Failed to search decks:', error);
      throw error;
    }
  },

  /**
   * Initialize the deck system - ensures default decks exist, returns all decks
   */
  initializeDecks: async (): Promise<IDeckWithAmount[]> => {
    try {
      return await deckService.getDefaultDecks();
    } catch (error) {
      console.error('Failed to initialize decks:', error);
      throw error;
    }
  },
};
