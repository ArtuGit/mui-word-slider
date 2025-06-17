import {db} from '../db/database';
import {IDeck} from '../types/deck.types';

export class DeckIndexedDbProvider {
  /**
   * Get all decks from IndexedDB
   */
  static async getAllDecks(): Promise<IDeck[]> {
    try {
      return await db.decks.toArray();
    } catch (error) {
      console.error('Failed to get decks from IndexedDB:', error);
      throw new Error('Failed to load decks from local storage');
    }
  }

  /**
   * Get a deck by ID
   */
  static async getDeckById(id: string): Promise<IDeck | undefined> {
    try {
      return await db.decks.get(id);
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
   * Search decks by topic or description
   */
  static async searchDecks(query: string): Promise<IDeck[]> {
    try {
      const lowerQuery = query.toLowerCase();
      return await db.decks
        .filter(
          deck =>
            deck.topic.toLowerCase().includes(lowerQuery) ||
            (deck.description?.toLowerCase().includes(lowerQuery) ?? false) ||
            deck.languageFrom.toLowerCase().includes(lowerQuery) ||
            deck.languageTo.toLowerCase().includes(lowerQuery)
        )
        .toArray();
    } catch (error) {
      console.error('Failed to search decks in IndexedDB:', error);
      throw new Error('Failed to search decks in local storage');
    }
  }
}
