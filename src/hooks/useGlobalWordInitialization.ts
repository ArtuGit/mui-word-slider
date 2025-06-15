import {useEffect} from 'react';
import {useLocation} from 'react-router-dom';
import {useCardsStore} from '../stores/useCardsStore.ts';
import {VALID_ROUTES} from '../constants/routes';
import {useDecksStore} from '../stores/useDecksStore';

/**
 * Custom hook that initializes default deck and cards when the app loads
 * Only runs once and only if the store is empty and on valid routes
 */
export const useGlobalWordInitialization = () => {
  const { initializeCards } = useCardsStore();
  const { initializeDecks } = useDecksStore();
  const location = useLocation();

  useEffect(() => {
    // Only initialize on valid routes (not 404 pages)
    const isValidRoute = (VALID_ROUTES as readonly string[]).includes(location.pathname);

    if (isValidRoute) {
      // Initialize decks first, then words
      const initialize = async () => {
        try {
          await initializeDecks();
          await initializeCards();
        } catch (error) {
          console.error('Failed to initialize app data:', error);
        }
      };

      initialize();
    }
  }, [initializeDecks, initializeCards, location.pathname]);
};
