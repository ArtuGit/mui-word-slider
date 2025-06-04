import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useWordsStore } from '../stores/useWordsStore';
import { VALID_ROUTES } from '../constants/routes';

/**
 * Custom hook that initializes default words pairs when the app loads
 * Only runs once and only if the store is empty and on valid routes
 */
export const useGlobalWordInitialization = () => {
  const { initializeWords } = useWordsStore();
  const location = useLocation();

  useEffect(() => {
    // Only initialize on valid routes (not 404 pages)
    const isValidRoute = (VALID_ROUTES as readonly string[]).includes(location.pathname);

    if (isValidRoute) {
      initializeWords();
    }
  }, [initializeWords, location.pathname]);
};
