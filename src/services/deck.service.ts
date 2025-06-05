import { Deck } from '../types/deck.types';
import { DeckIndexedDbProvider } from './deck.indexed-db-provider';
import { INITIAL_DECKS } from '../constants/initial-data';
import {delay} from "../utils/time.utils.ts";


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
      for (const initialDeck of INITIAL_DECKS) {
        await DeckIndexedDbProvider.saveDeck(initialDeck);
      }
      return [...INITIAL_DECKS];
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
