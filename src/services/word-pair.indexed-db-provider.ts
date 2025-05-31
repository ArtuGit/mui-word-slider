import { db } from '../db/database';
import { WordPair, WordPairList } from '../types/word.types';

export class WordPairIndexedDbProvider {
  /**
   * Get all word pairs from IndexedDB
   */
  static async getAllWordPairs(deckId?: string): Promise<WordPairList> {
    try {
      if (deckId) {
        return await db.wordPairs.where('deckId').equals(deckId).toArray();
      }
      return await db.wordPairs.toArray();
    } catch (error) {
      console.error('Failed to get word pairs from IndexedDB:', error);
      throw new Error('Failed to load word pairs from local storage');
    }
  }

  /**
   * Get word pairs by deck ID
   */
  static async getWordPairsByDeckId(deckId: string): Promise<WordPairList> {
    try {
      return await db.wordPairs.where('deckId').equals(deckId).toArray();
    } catch (error) {
      console.error('Failed to get word pairs by deck ID from IndexedDB:', error);
      throw new Error('Failed to load word pairs from local storage');
    }
  }

  /**
   * Save word pairs to IndexedDB (replaces all existing data for a specific deck)
   */
  static async saveWordPairs(wordPairs: WordPairList, deckId?: string): Promise<void> {
    try {
      await db.transaction('rw', db.wordPairs, async () => {
        if (deckId) {
          // Clear existing data for this deck only
          await db.wordPairs.where('deckId').equals(deckId).delete();
        } else {
          // Clear all existing data
          await db.wordPairs.clear();
        }
        // Add new data
        await db.wordPairs.bulkAdd(wordPairs);
      });
    } catch (error) {
      console.error('Failed to save word pairs to IndexedDB:', error);
      throw new Error('Failed to save word pairs to local storage');
    }
  }

  /**
   * Add a single word pair to IndexedDB
   */
  static async addWordPair(wordPair: WordPair): Promise<string> {
    try {
      return await db.wordPairs.add(wordPair);
    } catch (error) {
      console.error('Failed to add word pair to IndexedDB:', error);
      throw new Error('Failed to add word pair to local storage');
    }
  }

  /**
   * Update a word pair in IndexedDB
   */
  static async updateWordPair(id: string, updates: Partial<Omit<WordPair, 'id'>>): Promise<number> {
    try {
      return await db.wordPairs.update(id, updates);
    } catch (error) {
      console.error('Failed to update word pair in IndexedDB:', error);
      throw new Error('Failed to update word pair in local storage');
    }
  }

  /**
   * Delete a word pair from IndexedDB
   */
  static async deleteWordPair(id: string): Promise<void> {
    try {
      await db.wordPairs.delete(id);
    } catch (error) {
      console.error('Failed to delete word pair from IndexedDB:', error);
      throw new Error('Failed to delete word pair from local storage');
    }
  }

  /**
   * Delete all word pairs for a specific deck
   */
  static async deleteWordPairsByDeckId(deckId: string): Promise<number> {
    try {
      return await db.wordPairs.where('deckId').equals(deckId).delete();
    } catch (error) {
      console.error('Failed to delete word pairs by deck ID from IndexedDB:', error);
      throw new Error('Failed to delete word pairs from local storage');
    }
  }

  /**
   * Check if IndexedDB has any word pairs
   */
  static async hasWordPairs(deckId?: string): Promise<boolean> {
    try {
      if (deckId) {
        const count = await db.wordPairs.where('deckId').equals(deckId).count();
        return count > 0;
      }
      const count = await db.wordPairs.count();
      return count > 0;
    } catch (error) {
      console.error('Failed to check word pairs count in IndexedDB:', error);
      return false;
    }
  }

  /**
   * Clear all word pairs from IndexedDB
   */
  static async clearAllWordPairs(deckId?: string): Promise<void> {
    try {
      if (deckId) {
        await db.wordPairs.where('deckId').equals(deckId).delete();
      } else {
        await db.wordPairs.clear();
      }
    } catch (error) {
      console.error('Failed to clear word pairs from IndexedDB:', error);
      throw new Error('Failed to clear word pairs from local storage');
    }
  }

  /**
   * Get word pairs count
   */
  static async getWordPairsCount(deckId?: string): Promise<number> {
    try {
      if (deckId) {
        return await db.wordPairs.where('deckId').equals(deckId).count();
      }
      return await db.wordPairs.count();
    } catch (error) {
      console.error('Failed to get word pairs count from IndexedDB:', error);
      return 0;
    }
  }

  /**
   * Search word pairs by source or target word
   */
  static async searchWordPairs(query: string, deckId?: string): Promise<WordPairList> {
    try {
      const lowerQuery = query.toLowerCase();
      let collection = db.wordPairs.filter(
        wordPair =>
          wordPair.sourceWord.toLowerCase().includes(lowerQuery) ||
          wordPair.targetWord.toLowerCase().includes(lowerQuery) ||
          wordPair.pronunciation.toLowerCase().includes(lowerQuery) ||
          (wordPair.remark?.toLowerCase().includes(lowerQuery) ?? false)
      );

      if (deckId) {
        collection = collection.and(wordPair => wordPair.deckId === deckId);
      }

      return await collection.toArray();
    } catch (error) {
      console.error('Failed to search word pairs in IndexedDB:', error);
      throw new Error('Failed to search word pairs in local storage');
    }
  }
}
