import {useLiveQuery} from 'dexie-react-hooks';
import {db} from '../db/database';
import {ICardList} from '../types/card.types.ts';

/**
 * Custom hook that provides live access to cards from IndexedDB
 * The data will automatically update when the database changes
 */
export const useLiveCards = (): {
  cards: ICardList | undefined;
  isLoading: boolean;
  count: number;
} => {
  // Live query for all cards
  const cards = useLiveQuery(
    () => db.cards.toArray(),
      [] // No dependencies - always observe all cards
  );

  // Live query for count
  const count = useLiveQuery(() => db.cards.count(), []);

  return {
    cards,
    isLoading: cards === undefined,
    count: count ?? 0,
  };
};

/**
 * Custom hook for searching cards with live updates
 */
export const useLiveCardsSearch = (
  query: string
): {
  cards: ICardList | undefined;
  isLoading: boolean;
} => {
  const cards = useLiveQuery(
    async () => {
      if (!query.trim()) {
        return db.cards.toArray();
      }

      const lowerQuery = query.toLowerCase();
      return db.cards
        .filter(
            card =>
                card.sourceLanguage.toLowerCase().includes(lowerQuery) ||
                card.targetLanguage.toLowerCase().includes(lowerQuery) ||
                card.sourceWord.toLowerCase().includes(lowerQuery) ||
                card.targetWord.toLowerCase().includes(lowerQuery) ||
                card.pronunciation.toLowerCase().includes(lowerQuery) ||
                (card.remark?.toLowerCase().includes(lowerQuery) ?? false)
        )
        .toArray();
    },
    [query] // Re-run when query changes
  );

  return {
    cards: cards,
    isLoading: cards === undefined,
  };
};
