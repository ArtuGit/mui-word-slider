import { db } from '../db/database';
import { IDeck, IDeckWithAmount } from '../types/deck.types';
import { CardIndexedDbProvider } from './card-indexed-db.provider';

export class DeckIndexedDbProvider {
  /**
   * Get all decks from IndexedDB with calculated amounts
   */
  static async getAllDecks(): Promise<IDeckWithAmount[]> {
    try {
      const decks = await db.decks.toArray();
      const decksWithAmount = await Promise.all(
        decks.map(async deck => ({
          ...deck,
          amount: await CardIndexedDbProvider.getCardsCount(deck.id),
        }))
      );
      return decksWithAmount;
    } catch (error) {
      console.error('Failed to get decks from IndexedDB:', error);
      throw new Error('Failed to load decks from local storage');
    }
  }

  /**
   * Get a deck by ID with calculated amount
   */
  static async getDeckById(id: string): Promise<IDeckWithAmount | undefined> {
    try {
      const deck = await db.decks.get(id);
      if (!deck) return undefined;

      const amount = await CardIndexedDbProvider.getCardsCount(deck.id);
      return {
        ...deck,
        amount,
      };
    } catch (error) {
      console.error('Failed to get deck by ID from IndexedDB:', error);
      throw new Error('Failed to load deck from local storage');
    }
  }

  /**
   * Save a deck to IndexedDB
   */
  static async saveDeck(deck: IDeck): Promise<string> {
    try {
      return await db.decks.add(deck);
    } catch (error) {
      console.error('Failed to save deck to IndexedDB:', error);
      throw new Error('Failed to save deck to local storage');
    }
  }

  /**
   * Save multiple decks to IndexedDB (bulk operation)
   */
  static async saveDecks(decks: IDeck[]): Promise<void> {
    try {
      await db.decks.bulkAdd(decks);
    } catch (error) {
      console.error('Failed to save decks to IndexedDB:', error);
      throw new Error('Failed to save decks to local storage');
    }
  }

  /**
   * Update a deck in IndexedDB
   */
  static async updateDeck(id: string, updates: Partial<Omit<IDeck, 'id'>>): Promise<number> {
    try {
      return await db.decks.update(id, updates);
    } catch (error) {
      console.error('Failed to update deck in IndexedDB:', error);
      throw new Error('Failed to update deck in local storage');
    }
  }

  /**
   * Delete a deck from IndexedDB
   */
  static async deleteDeck(id: string): Promise<void> {
    try {
      await db.decks.delete(id);
    } catch (error) {
      console.error('Failed to delete deck from IndexedDB:', error);
      throw new Error('Failed to delete deck from local storage');
    }
  }

  /**
   * Check if IndexedDB has any decks
   */
  static async hasDecks(): Promise<boolean> {
    try {
      const count = await db.decks.count();
      return count > 0;
    } catch (error) {
      console.error('Failed to check decks count in IndexedDB:', error);
      return false;
    }
  }

  /**
   * Get decks count
   */
  static async getDecksCount(): Promise<number> {
    try {
      return await db.decks.count();
    } catch (error) {
      console.error('Failed to get decks count from IndexedDB:', error);
      return 0;
    }
  }

  /**
   * Search decks by topic or description with calculated amounts
   */
  static async searchDecks(query: string): Promise<IDeckWithAmount[]> {
    try {
      const lowerQuery = query.toLowerCase();
      const decks = await db.decks
        .filter(
          deck =>
            deck.topic.toLowerCase().includes(lowerQuery) ||
            (deck.description?.toLowerCase().includes(lowerQuery) ?? false) ||
            deck.languageFrom.toLowerCase().includes(lowerQuery) ||
            deck.languageTo.toLowerCase().includes(lowerQuery)
        )
        .toArray();

      const decksWithAmount = await Promise.all(
        decks.map(async deck => ({
          ...deck,
          amount: await CardIndexedDbProvider.getCardsCount(deck.id),
        }))
      );
      return decksWithAmount;
    } catch (error) {
      console.error('Failed to search decks in IndexedDB:', error);
      throw new Error('Failed to search decks in local storage');
    }
  }
}
