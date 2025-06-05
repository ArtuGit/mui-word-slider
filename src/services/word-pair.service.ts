import { WordPairList } from '../types/word.types';
import { WordPairIndexedDbProvider } from './word-pair.indexed-db-provider.ts';
import { deckService } from './deck.service';
import { INITIAL_WORDS } from '../constants/initial-data';
import {delay} from "../utils/time.utils.ts";

export const wordPairService = {
  /**
   * Get default word pairs (mock data with simulated network delay)
   */
  getDefaultWordPairs: async (deckId?: string): Promise<WordPairList> => {
    // Simulate network delay between 500ms and 1500ms
    await delay(Math.random() * 1000 + 500);

    if (deckId) {
      return INITIAL_WORDS.filter(word => word.deckId === deckId);
    }
    return INITIAL_WORDS;
  },

  /**
   * Load word pairs from IndexedDB
   */
  loadWordPairs: async (deckId?: string): Promise<WordPairList> => {
    try {
      return await WordPairIndexedDbProvider.getAllWordPairs(deckId);
    } catch (error) {
      console.error('Failed to load word pairs from IndexedDB:', error);
      throw error;
    }
  },

  /**
   * Load word pairs for a specific deck
   */
  loadWordPairsByDeckId: async (deckId: string): Promise<WordPairList> => {
    try {
      return await WordPairIndexedDbProvider.getWordPairsByDeckId(deckId);
    } catch (error) {
      console.error('Failed to load word pairs by deck ID:', error);
      throw error;
    }
  },

  /**
   * Save word pairs to IndexedDB
   */
  saveWordPairs: async (wordPairs: WordPairList, deckId?: string): Promise<void> => {
    try {
      await WordPairIndexedDbProvider.saveWordPairs(wordPairs, deckId);
    } catch (error) {
      console.error('Failed to save word pairs to IndexedDB:', error);
      throw error;
    }
  },

  /**
   * Check if IndexedDB has word pairs stored
   */
  hasStoredWordPairs: async (deckId?: string): Promise<boolean> => {
    try {
      return await WordPairIndexedDbProvider.hasWordPairs(deckId);
    } catch (error) {
      console.error('Failed to check stored word pairs:', error);
      return false;
    }
  },

  /**
   * Initialize word pairs: load from IndexedDB if available, otherwise load defaults and save them
   */
  initializeWordPairs: async (deckId?: string): Promise<WordPairList> => {
    try {
      // If no deckId provided, get the default deck
      let targetDeckId = deckId;
      if (!targetDeckId) {
        const defaultDeck = await deckService.getDefaultDeck();
        targetDeckId = defaultDeck.id;
      }

      // Check if we have stored word pairs for this deck
      const hasStored = await WordPairIndexedDbProvider.hasWordPairs(targetDeckId);

      if (hasStored) {
        // Load from IndexedDB
        return await WordPairIndexedDbProvider.getAllWordPairs(targetDeckId);
      } else {
        // Load default words for this deck and save them to IndexedDB
        const defaultWords = await wordPairService.getDefaultWordPairs(targetDeckId);
        await WordPairIndexedDbProvider.saveWordPairs(defaultWords, targetDeckId);
        return defaultWords;
      }
    } catch (error) {
      console.error('Failed to initialize word pairs:', error);
      // Fallback to default words without saving
      return await wordPairService.getDefaultWordPairs(deckId);
    }
  },

  /**
   * Clear all stored word pairs from IndexedDB
   */
  clearStoredWordPairs: async (deckId?: string): Promise<void> => {
    try {
      await WordPairIndexedDbProvider.clearAllWordPairs(deckId);
    } catch (error) {
      console.error('Failed to clear stored word pairs:', error);
      throw error;
    }
  },

  /**
   * Get word pairs count from IndexedDB
   */
  getStoredWordPairsCount: async (deckId?: string): Promise<number> => {
    try {
      return await WordPairIndexedDbProvider.getWordPairsCount(deckId);
    } catch (error) {
      console.error('Failed to get stored word pairs count:', error);
      return 0;
    }
  },

  /**
   * Search word pairs in IndexedDB
   */
  searchStoredWordPairs: async (query: string, deckId?: string): Promise<WordPairList> => {
    try {
      return await WordPairIndexedDbProvider.searchWordPairs(query, deckId);
    } catch (error) {
      console.error('Failed to search stored word pairs:', error);
      throw error;
    }
  },
};
