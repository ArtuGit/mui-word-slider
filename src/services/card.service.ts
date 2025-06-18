import {ICardList} from '../types/card.types.ts';
import {CardIndexedDbProvider} from './card-indexed-db.provider.ts';
import {INITIAL_CARDS} from '../constants/initial-data';
import {delay} from '../utils/time.utils.ts';

export const cardService = {
  /**
   * Get default cards (mock data with simulated network delay)
   */
  getDefaultCards: async (): Promise<ICardList> => {
    // Simulate network delay between 500ms and 1500ms
    await delay(Math.random() * 1000 + 500);

    return INITIAL_CARDS;
  },

  /**
   * Load cards from IndexedDB
   */
  loadCards: async (deckId: string): Promise<ICardList> => {
    try {
      return await CardIndexedDbProvider.getCardsByDeckId(deckId);
    } catch (error) {
      console.error('Failed to load cards from IndexedDB:', error);
      throw error;
    }
  },

  /**
   * Save cards to IndexedDB
   */
  saveCards: async (cards: ICardList, deckId?: string): Promise<void> => {
    try {
      await CardIndexedDbProvider.saveCards(cards, deckId);
    } catch (error) {
      console.error('Failed to save cards to IndexedDB:', error);
      throw error;
    }
  },

  /**
   * Check if IndexedDB has cards stored
   */
  hasCards: async (deckId?: string): Promise<boolean> => {
    try {
      return await CardIndexedDbProvider.hasCards(deckId);
    } catch (error) {
      console.error('Failed to check stored cards:', error);
      return false;
    }
  },

  /**
   * Initialize cards: save defaults to IndexedDB if not available
   */
  initializeCards: async (): Promise<void> => {
    try {
      // Check if we have stored cards
      const hasStored = await cardService.hasCards();

      if (!hasStored) {
        // Load from IndexedDB
        const defaultWords = await cardService.getDefaultCards();
        await CardIndexedDbProvider.saveCards(defaultWords);
      }
    } catch (error) {
      console.error('Failed to initialize cards:', error);
    }
  },

  /**
   * Clear all stored cards from IndexedDB
   */
  clearCards: async (deckId?: string): Promise<void> => {
    try {
      await CardIndexedDbProvider.clearCards(deckId);
    } catch (error) {
      console.error('Failed to clear stored cards:', error);
      throw error;
    }
  },

  /**
   * Get cards count from IndexedDB
   */
  getStoredCardsCount: async (deckId?: string): Promise<number> => {
    try {
      return await CardIndexedDbProvider.getCardsCount(deckId);
    } catch (error) {
      console.error('Failed to get stored cards count:', error);
      return 0;
    }
  },

  /**
   * Search cards in IndexedDB
   */
  searchStoredCards: async (query: string, deckId?: string): Promise<ICardList> => {
    try {
      return await CardIndexedDbProvider.searchCards(query, deckId);
    } catch (error) {
      console.error('Failed to search stored cards:', error);
      throw error;
    }
  },
};
