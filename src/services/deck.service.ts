import { Deck } from '../types/deck.types';
import { DeckIndexedDbProvider } from './deck.indexed-db-provider';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Default decks configuration
const DEFAULT_DECKS: Deck[] = [
  {
    id: 'default-deck-1',
    topic: 'Polish Common Phrases',
    description: 'Essential Polish phrases for everyday conversation',
    languageFrom: 'Polish',
    languageTo: 'English',
    amount: 30,
    promptToAiAgent:
      'Please create JSON with Polish common phrases and their English translations, including pronunciation and remarks for context.',
  },
  // Add more default decks here in the future
];

/**
 * Get default decks (creates default decks if none exist)
 */
const getDefaultDecks = async (): Promise<Deck[]> => {
  try {
    // Simulate network delay between 500ms and 1500ms
    await delay(Math.random() * 1000 + 500);

    const allDecks = await DeckIndexedDbProvider.getAllDecks();

    if (allDecks.length === 0) {
      // Create default decks if none exist
      for (const defaultDeck of DEFAULT_DECKS) {
        await DeckIndexedDbProvider.saveDeck(defaultDeck);
      }
      return [...DEFAULT_DECKS];
    }

    return allDecks;
  } catch (error) {
    console.error('Failed to get default decks:', error);
    throw error;
  }
};

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
      const defaultDecks = await getDefaultDecks();
      if (defaultDecks.length === 0) {
        throw new Error('No default deck available');
      }
      return defaultDecks[0]; // Return the first deck as the default
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
   * Get default decks (creates default decks if none exist)
   */
  getDefaultDecks,

  /**
   * Initialize the deck system - ensures default decks exist, returns all decks
   */
  initializeDecks: async (): Promise<Deck[]> => {
    try {
      return await getDefaultDecks();
    } catch (error) {
      console.error('Failed to initialize decks:', error);
      throw error;
    }
  },
};
