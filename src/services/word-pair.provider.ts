import { WordPairList } from '../types/word.types';

const mockWords: WordPairList = [
  { id: '1', sourceWord: 'Dzień dobry', targetWord: 'Good morning' },
  { id: '2', sourceWord: 'Do widzenia', targetWord: 'Goodbye' },
  { id: '3', sourceWord: 'Proszę', targetWord: 'Please' },
  { id: '4', sourceWord: 'Dziękuję', targetWord: 'Thank you' },
  { id: '5', sourceWord: 'Przepraszam', targetWord: 'Sorry' },
  { id: '6', sourceWord: 'Tak', targetWord: 'Yes' },
  { id: '7', sourceWord: 'Nie', targetWord: 'No' },
  { id: '8', sourceWord: 'Cześć', targetWord: 'Hi' },
  { id: '9', sourceWord: 'Jak się masz?', targetWord: 'How are you?' },
  { id: '10', sourceWord: 'Dobranoc', targetWord: 'Good night' },
  { id: '11', sourceWord: 'Kocham cię', targetWord: 'I love you' },
  { id: '12', sourceWord: 'Smacznego', targetWord: 'Enjoy your meal' },
  { id: '13', sourceWord: 'Na zdrowie', targetWord: 'Cheers' },
  { id: '14', sourceWord: 'Gdzie jest...?', targetWord: 'Where is...?' },
  { id: '15', sourceWord: 'Co słychać?', targetWord: "What's up?" },
  { id: '16', sourceWord: 'Wszystkiego najlepszego', targetWord: 'All the best' },
  { id: '17', sourceWord: 'Powodzenia', targetWord: 'Good luck' },
  { id: '18', sourceWord: 'Rozumiem', targetWord: 'I understand' },
  { id: '19', sourceWord: 'Nie rozumiem', targetWord: "I don't understand" },
  { id: '20', sourceWord: 'Dobry wieczór', targetWord: 'Good evening' },
];

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const wordPairProvider = {
  getDefaultWordPairs: async (): Promise<WordPairList> => {
    // Simulate network delay between 500ms and 1500ms
    await delay(Math.random() * 1000 + 500);
    return mockWords;
  },
};
