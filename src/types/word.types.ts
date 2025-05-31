export interface WordPair {
  id: string;
  sourceLanguage: string;
  targetLanguage: string;
  sourceWord: string;
  targetWord: string;
  pronunciation: string;
  remark?: string; // Optional additional context or meaning clarification
}

export type WordPairList = WordPair[];
