export interface ICard {
  id: string;
  deckId: string;
  sourceLanguage: string;
  targetLanguage: string;
  sourceWord: string;
  targetWord: string;
  pronunciation: string;
  remark?: string; // Optional additional context or meaning clarification
}

export type ICardList = ICard[];
