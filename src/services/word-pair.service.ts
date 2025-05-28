import { WordPairList } from '../types/word.types';
import { WordPairIndexedDbProvider } from './word-pair.indexed-db-provider.ts';

const mockWords: WordPairList = [
  {
    id: '1',
    sourceWord: 'Dzień dobry',
    targetWord: 'Good morning',
    pronunciation: '/d͡ʑɛɲ ˈdɔbrɨ/',
    remark: 'Formal greeting used until afternoon',
  },
  {
    id: '2',
    sourceWord: 'Do widzenia',
    targetWord: 'Goodbye',
    pronunciation: '/dɔ viˈd͡zɛɲa/',
    remark: 'Formal farewell, literally "until seeing"',
  },
  {
    id: '3',
    sourceWord: 'Proszę',
    targetWord: 'Please',
    pronunciation: '/ˈprɔʂɛ/',
    remark: 'Also means "you\'re welcome" or "here you go"',
  },
  {
    id: '4',
    sourceWord: 'Dziękuję',
    targetWord: 'Thank you',
    pronunciation: '/d͡ʑɛŋˈkujɛ/',
  },
  {
    id: '5',
    sourceWord: 'Przepraszam',
    targetWord: 'Sorry',
    pronunciation: '/pʂɛˈpraʂam/',
    remark: 'Also used for "excuse me" to get attention',
  },
  {
    id: '6',
    sourceWord: 'Tak',
    targetWord: 'Yes',
    pronunciation: '/tak/',
  },
  {
    id: '7',
    sourceWord: 'Nie',
    targetWord: 'No',
    pronunciation: '/ɲɛ/',
  },
  {
    id: '8',
    sourceWord: 'Cześć',
    targetWord: 'Hi',
    pronunciation: '/t͡ʂɛɕt͡ɕ/',
    remark: 'Informal greeting, also used for goodbye',
  },
  {
    id: '9',
    sourceWord: 'Jak się masz?',
    targetWord: 'How are you?',
    pronunciation: '/jak ɕɛ maʂ/',
    remark: "Informal way to ask about someone's wellbeing",
  },
  {
    id: '10',
    sourceWord: 'Dobranoc',
    targetWord: 'Good night',
    pronunciation: '/dɔˈbranɔt͡s/',
    remark: 'Used when going to sleep or leaving late evening',
  },
  {
    id: '11',
    sourceWord: 'Kocham cię',
    targetWord: 'I love you',
    pronunciation: '/ˈkɔxam t͡ɕɛ/',
    remark: 'Strong expression of love, very intimate',
  },
  {
    id: '12',
    sourceWord: 'Smacznego',
    targetWord: 'Enjoy your meal',
    pronunciation: '/smat͡ʂˈnɛɡɔ/',
    remark: 'Said before eating, equivalent to "bon appétit"',
  },
  {
    id: '13',
    sourceWord: 'Na zdrowie',
    targetWord: 'Cheers',
    pronunciation: '/na ˈzdrɔvjɛ/',
    remark: 'Literally "to your health", also said after sneezing',
  },
  {
    id: '14',
    sourceWord: 'Gdzie jest...?',
    targetWord: 'Where is...?',
    pronunciation: '/ɡd͡ʑɛ jɛst/',
    remark: 'Question phrase for asking location',
  },
  {
    id: '15',
    sourceWord: 'Co słychać?',
    targetWord: "What's up?",
    pronunciation: '/t͡sɔ ˈswɨxat͡ɕ/',
    remark: 'Informal way to ask "what\'s new?" or "how are things?"',
  },
  {
    id: '16',
    sourceWord: 'Wszystkiego najlepszego',
    targetWord: 'All the best',
    pronunciation: '/fʂɨstˈkjɛɡɔ najˈlɛpʂɛɡɔ/',
    remark: 'Used for birthdays, holidays, or general well-wishes',
  },
  {
    id: '17',
    sourceWord: 'Powodzenia',
    targetWord: 'Good luck',
    pronunciation: '/pɔvɔˈd͡zɛɲa/',
    remark: 'Wishing success in endeavors',
  },
  {
    id: '18',
    sourceWord: 'Rozumiem',
    targetWord: 'I understand',
    pronunciation: '/rɔˈzumjɛm/',
  },
  {
    id: '19',
    sourceWord: 'Nie rozumiem',
    targetWord: "I don't understand",
    pronunciation: '/ɲɛ rɔˈzumjɛm/',
    remark: 'Useful phrase when learning the language',
  },
  {
    id: '20',
    sourceWord: 'Dobry wieczór',
    targetWord: 'Good evening',
    pronunciation: '/ˈdɔbrɨ ˈvjɛt͡ʂur/',
    remark: 'Formal greeting used from late afternoon onwards',
  },
];

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const wordPairService = {
  /**
   * Get default word pairs (mock data with simulated network delay)
   */
  getDefaultWordPairs: async (): Promise<WordPairList> => {
    // Simulate network delay between 500ms and 1500ms
    await delay(Math.random() * 1000 + 500);
    return mockWords;
  },

  /**
   * Load word pairs from IndexedDB
   */
  loadWordPairs: async (): Promise<WordPairList> => {
    try {
      return await WordPairIndexedDbProvider.getAllWordPairs();
    } catch (error) {
      console.error('Failed to load word pairs from IndexedDB:', error);
      throw error;
    }
  },

  /**
   * Save word pairs to IndexedDB
   */
  saveWordPairs: async (wordPairs: WordPairList): Promise<void> => {
    try {
      await WordPairIndexedDbProvider.saveWordPairs(wordPairs);
    } catch (error) {
      console.error('Failed to save word pairs to IndexedDB:', error);
      throw error;
    }
  },

  /**
   * Check if IndexedDB has word pairs stored
   */
  hasStoredWordPairs: async (): Promise<boolean> => {
    try {
      return await WordPairIndexedDbProvider.hasWordPairs();
    } catch (error) {
      console.error('Failed to check stored word pairs:', error);
      return false;
    }
  },

  /**
   * Initialize word pairs: load from IndexedDB if available, otherwise load defaults and save them
   */
  initializeWordPairs: async (): Promise<WordPairList> => {
    try {
      // Check if we have stored word pairs
      const hasStored = await WordPairIndexedDbProvider.hasWordPairs();

      if (hasStored) {
        // Load from IndexedDB
        return await WordPairIndexedDbProvider.getAllWordPairs();
      } else {
        // Load default words and save them to IndexedDB
        const defaultWords = await wordPairService.getDefaultWordPairs();
        await WordPairIndexedDbProvider.saveWordPairs(defaultWords);
        return defaultWords;
      }
    } catch (error) {
      console.error('Failed to initialize word pairs:', error);
      // Fallback to default words without saving
      return await wordPairService.getDefaultWordPairs();
    }
  },

  /**
   * Clear all stored word pairs from IndexedDB
   */
  clearStoredWordPairs: async (): Promise<void> => {
    try {
      await WordPairIndexedDbProvider.clearAllWordPairs();
    } catch (error) {
      console.error('Failed to clear stored word pairs:', error);
      throw error;
    }
  },

  /**
   * Get word pairs count from IndexedDB
   */
  getStoredWordPairsCount: async (): Promise<number> => {
    try {
      return await WordPairIndexedDbProvider.getWordPairsCount();
    } catch (error) {
      console.error('Failed to get stored word pairs count:', error);
      return 0;
    }
  },

  /**
   * Search word pairs in IndexedDB
   */
  searchStoredWordPairs: async (query: string): Promise<WordPairList> => {
    try {
      return await WordPairIndexedDbProvider.searchWordPairs(query);
    } catch (error) {
      console.error('Failed to search stored word pairs:', error);
      throw error;
    }
  },
};
