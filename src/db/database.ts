import Dexie, { type EntityTable } from 'dexie';
import { WordPair } from '../types/word.types';
import { Deck } from '../types/deck.types';

// Define the database interface
export interface WordPairDB extends Dexie {
  wordPairs: EntityTable<WordPair, 'id'>;
  decks: EntityTable<Deck, 'id'>;
}

// Create the database instance
export const db = new Dexie('MemVocabDB') as WordPairDB;

// Define the schema
db.version(1).stores({
  wordPairs: 'id, deckId, sourceWord, targetWord, pronunciation, remark',
  decks: 'id, topic, description, languageFrom, languageTo, amount',
});

export default db;
