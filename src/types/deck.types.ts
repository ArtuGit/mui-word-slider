import type { ICard } from './card.types';

export interface IDeck {
  id: string;
  topic: string;
  description?: string;
  languageFrom: string;
  languageTo: string;
  amount: number;
  promptToAiAgent?: string;
}

export interface IDeckWithCards extends IDeck {
  cards: ICard[];
}
