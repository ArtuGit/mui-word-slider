export interface IDeck {
  id: string;
  topic: string;
  description?: string;
  languageFrom: string;
  languageTo: string;
  amount: number;
  promptToAiAgent: string;
}
