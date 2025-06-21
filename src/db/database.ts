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

// Migration to remove amount field from decks
db.version(2)
  .stores({
    decks: 'id, topic, description, languageFrom, languageTo',
    cards:
      'id, deckId, sourceLanguage, targetLanguage, sourceWord, targetWord, pronunciation, remark', // id is primary key, others are indexed
  })
  .upgrade(tx => {
    // Remove amount field from existing decks
    return tx
      .table('decks')
      .toCollection()
      .modify((deck: Record<string, unknown>) => {
        delete deck.amount;
      });
  });

export default db;
