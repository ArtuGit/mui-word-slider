import Dexie, { type EntityTable } from 'dexie';
import { ICard } from '../types/card.types.ts';
import { IDeck } from '../types/deck.types';

// Define the database interface
export interface CardDB extends Dexie {
  cards: EntityTable<ICard, 'id'>;
  decks: EntityTable<IDeck, 'id'>;
}

// Create the database instance
export const db = new Dexie('MemVocabDB') as CardDB;

// Define the schema
db.version(1).stores({
  decks: 'id, topic, description, languageFrom, languageTo, amount',
  cards:
    'id, deckId, sourceLanguage, targetLanguage, sourceWord, targetWord, pronunciation, remark', // id is primary key, others are indexed
});

export default db;
