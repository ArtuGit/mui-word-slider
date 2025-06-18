import {db} from '../db/database';
import {ICardList} from '../types/card.types.ts';

export class CardIndexedDbProvider {
  /**
   * Get cards by deck ID
   */
  static async getCardsByDeckId(deckId: string): Promise<ICardList> {
    try {
      return await db.cards.where('deckId').equals(deckId).toArray();
    } catch (error) {
      console.error('Failed to get cards by deck ID from IndexedDB:', error);
      throw new Error('Failed to load cards from local storage');
    }
  }

  /**
   * Save cards to IndexedDB (replaces all existing data for a specific deck)
   */
  static async saveCards(cards: ICardList, deckId?: string): Promise<void> {
    try {
      await db.transaction('rw', db.cards, async () => {
        if (deckId) {
          // Clear existing data for this deck only
          await db.cards.where('deckId').equals(deckId).delete();
        } else {
          // Clear all existing data
          await db.cards.clear();
        }
        // Add new data
        await db.cards.bulkAdd(cards);
      });
    } catch (error) {
      console.error('Failed to save cards to IndexedDB:', error);
      throw new Error('Failed to save cards to local storage');
    }
  }

  /**
   * Delete all cards for a specific deck
   */
  static async deleteCardsByDeckId(deckId: string): Promise<number> {
    try {
      return await db.cards.where('deckId').equals(deckId).delete();
    } catch (error) {
      console.error('Failed to delete cards by deck ID from IndexedDB:', error);
      throw new Error('Failed to delete cards from local storage');
    }
  }

  /**
   * Check if IndexedDB has any cards
   */
  static async hasCards(deckId?: string): Promise<boolean> {
    try {
      if (deckId) {
        const count = await db.cards.where('deckId').equals(deckId).count();
        return count > 0;
      }
      const count = await db.cards.count();
      return count > 0;
    } catch (error) {
      console.error('Failed to check cards count in IndexedDB:', error);
      return false;
    }
  }

  /**
   * Clear cards from IndexedDB
   */
  static async clearCards(deckId?: string): Promise<void> {
    try {
      if (deckId) {
        await db.cards.where('deckId').equals(deckId).delete();
      } else {
        await db.cards.clear();
      }
    } catch (error) {
      console.error('Failed to clear cards from IndexedDB:', error);
      throw new Error('Failed to clear cards from local storage');
    }
  }

  /**
   * Get cards count
   */
  static async getCardsCount(deckId?: string): Promise<number> {
    try {
      if (deckId) {
        return await db.cards.where('deckId').equals(deckId).count();
      }
      return await db.cards.count();
    } catch (error) {
      console.error('Failed to get cards count from IndexedDB:', error);
      return 0;
    }
  }

  /**
   * Search cards by source or target word
   */
  static async searchCards(query: string, deckId?: string): Promise<ICardList> {
    try {
      const lowerQuery = query.toLowerCase();
      let collection = db.cards.filter(
        wordPair =>
          wordPair.sourceWord.toLowerCase().includes(lowerQuery) ||
          wordPair.targetWord.toLowerCase().includes(lowerQuery) ||
          wordPair.sourceLanguage.toLowerCase().includes(lowerQuery) ||
          wordPair.targetLanguage.toLowerCase().includes(lowerQuery) ||
          wordPair.pronunciation.toLowerCase().includes(lowerQuery) ||
          (wordPair.remark?.toLowerCase().includes(lowerQuery) ?? false)
      );

      if (deckId) {
        collection = collection.and(wordPair => wordPair.deckId === deckId);
      }

      return await collection.toArray();
    } catch (error) {
      console.error('Failed to search cards in IndexedDB:', error);
      throw new Error('Failed to search cards in local storage');
    }
  }
}
