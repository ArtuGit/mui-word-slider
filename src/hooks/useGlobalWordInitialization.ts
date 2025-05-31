import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useWordsStore } from '../stores/useWordsStore';
import { useDecksStore } from '../stores/useDecksStore';

/**
 * Custom hook that initializes default deck and word pairs when the app loads
 * Only runs once and only if the store is empty and on valid routes
 */
export const useGlobalWordInitialization = () => {
  const { initializeWords } = useWordsStore();
  const { initializeDecks } = useDecksStore();
  const location = useLocation();

  useEffect(() => {
    // Only initialize on valid routes (not 404 pages)
    const isValidRoute = ['/', '/learn', '/upload', '/debug'].includes(location.pathname);

    if (isValidRoute) {
      // Initialize decks first, then words
      const initialize = async () => {
        try {
          await initializeDecks();
          await initializeWords();
        } catch (error) {
          console.error('Failed to initialize app data:', error);
        }
      };

      initialize();
    }
  }, [initializeDecks, initializeWords, location.pathname]);
};
