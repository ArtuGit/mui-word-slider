import { useEffect } from 'react';
import { useWordsStore } from '../stores/useWordsStore';

/**
 * Custom hook that initializes default words pairs when the app loads
 * Only runs once and only if the store is empty
 */
export const useGlobalWordInitialization = () => {
  const { initializeWords } = useWordsStore();

  useEffect(() => {
    initializeWords();
  }, [initializeWords]);
};
