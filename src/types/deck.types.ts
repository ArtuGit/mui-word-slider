export interface Deck {
  id: string;
  topic: string;
  description?: string;
  languageFrom: string;
  languageTo: string;
  amount: number;
  promptToAiAgent: string;
}
