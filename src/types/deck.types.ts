import type {ICard} from './card.types';

export interface IDeck {
  id: string;
  topic: string;
  description?: string;
  languageFrom: string;
  languageTo: string;
  promptToAiAgent?: string;
}

export interface IDeckWithAmount extends IDeck {
  amount: number;
}

export interface IDeckWithCards extends IDeck {
  cards: ICard[];
}
