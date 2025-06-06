import {ICardList} from '../types/card.types.ts';
import {CardIndexedDbProvider} from './card-indexed-db.provider.ts';
import {deckService} from './deck.service';
import {INITIAL_CARDS} from '../constants/initial-data';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const cardService = {
  /**
   * Get default cards (mock data with simulated network delay)
   */
  getDefaultCards: async (deckId?: string): Promise<ICardList> => {
    // Simulate network delay between 500ms and 1500ms
    await delay(Math.random() * 1000 + 500);

    if (deckId) {
      return INITIAL_CARDS.filter(word => word.deckId === deckId);
    }
    return INITIAL_CARDS;
  },

  /**
   * Load cards from IndexedDB
   */
  loadCards: async (deckId?: string): Promise<ICardList> => {
    try {
      return await CardIndexedDbProvider.getAllCards(deckId);
    } catch (error) {
      console.error('Failed to load cards from IndexedDB:', error);
      throw error;
    }
  },

  /**
   * Load cards for a specific deck
   */
  loadCardsByDeckId: async (deckId: string): Promise<ICardList> => {
    try {
      return await CardIndexedDbProvider.getCardsByDeckId(deckId);
    } catch (error) {
      console.error('Failed to load cards by deck ID:', error);
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
  hasStoredCards: async (deckId?: string): Promise<boolean> => {
    try {
      return await CardIndexedDbProvider.hasCards(deckId);
    } catch (error) {
      console.error('Failed to check stored cards:', error);
      return false;
    }
  },

  /**
   * Initialize cards: load from IndexedDB if available, otherwise load defaults and save them
   */
  initializeCards: async (deckId?: string): Promise<ICardList> => {
    try {
      // If no deckId provided, get the default deck
      let targetDeckId = deckId;
      if (!targetDeckId) {
        const defaultDeck = await deckService.getDefaultDeck();
        targetDeckId = defaultDeck.id;
      }

      // Check if we have stored cards for this deck
      const hasStored = await CardIndexedDbProvider.hasCards(targetDeckId);

      if (hasStored) {
        // Load from IndexedDB
        return await CardIndexedDbProvider.getAllCards(targetDeckId);
      } else {
        // Load default words for this deck and save them to IndexedDB
        const defaultWords = await cardService.getDefaultCards(targetDeckId);
        await CardIndexedDbProvider.saveCards(defaultWords, targetDeckId);
        return defaultWords;
      }
    } catch (error) {
      console.error('Failed to initialize cards:', error);
      // Fallback to default words without saving
      return await cardService.getDefaultCards(deckId);
    }
  },

  /**
   * Clear all stored cards from IndexedDB
   */
  clearStoredCards: async (deckId?: string): Promise<void> => {
    try {
      await CardIndexedDbProvider.clearAllCards(deckId);
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
