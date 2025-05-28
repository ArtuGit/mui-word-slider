import Dexie, { type EntityTable } from 'dexie';
import { WordPair } from '../types/word.types';

// Define the database interface
export interface WordPairDB extends Dexie {
  wordPairs: EntityTable<WordPair, 'id'>;
}

// Create the database instance
export const db = new Dexie('MemVocabDB') as WordPairDB;

// Define the schema
db.version(1).stores({
  wordPairs: 'id, sourceWord, targetWord', // id is primary key, others are indexed
});

export default db;
