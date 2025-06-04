import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import { WordPairList } from '../types/word.types';

/**
 * Custom hook that provides live access to word pairs from IndexedDB
 * The data will automatically update when the database changes
 */
export const useLiveWordPairs = (): {
  wordPairs: WordPairList | undefined;
  isLoading: boolean;
  count: number;
} => {
  // Live query for all word pairs
  const wordPairs = useLiveQuery(
    () => db.wordPairs.toArray(),
    [] // No dependencies - always observe all word pairs
  );

  // Live query for count
  const count = useLiveQuery(() => db.wordPairs.count(), []);

  return {
    wordPairs,
    isLoading: wordPairs === undefined,
    count: count ?? 0,
  };
};

/**
 * Custom hook for searching word pairs with live updates
 */
export const useLiveWordPairsSearch = (
  query: string
): {
  wordPairs: WordPairList | undefined;
  isLoading: boolean;
} => {
  const wordPairs = useLiveQuery(
    async () => {
      if (!query.trim()) {
        return db.wordPairs.toArray();
      }

      const lowerQuery = query.toLowerCase();
      return db.wordPairs
        .filter(
          wordPair =>
            wordPair.sourceLanguage.toLowerCase().includes(lowerQuery) ||
            wordPair.targetLanguage.toLowerCase().includes(lowerQuery) ||
            wordPair.sourceWord.toLowerCase().includes(lowerQuery) ||
            wordPair.targetWord.toLowerCase().includes(lowerQuery) ||
            wordPair.pronunciation.toLowerCase().includes(lowerQuery) ||
            (wordPair.remark?.toLowerCase().includes(lowerQuery) ?? false)
        )
        .toArray();
    },
    [query] // Re-run when query changes
  );

  return {
    wordPairs,
    isLoading: wordPairs === undefined,
  };
};
