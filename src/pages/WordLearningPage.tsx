import { FC, useEffect } from 'react';
import { Alert, Box, CircularProgress, Container } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import WordCardSlider from '../components/word/WordCardSlider.tsx';
import { useCardsStore } from '../stores/useCardsStore.ts';
import { useDecksStore } from '../stores/useDecksStore';

export const WordLearningPage: FC = () => {
  const { deckId } = useParams<{ deckId: string }>();
  const navigate = useNavigate();
  const { words, isLoading, error, clearError, initializeCards, clearWords } = useCardsStore();
  const { setCurrentDeck, getDeckById } = useDecksStore();

  useEffect(() => {
    const loadDeckAndWords = async () => {
      if (!deckId) {
        // If no deckId, redirect to decks page
        navigate('/decks');
        return;
      }

      try {
        // Clear existing words first
        clearWords();

        // Get the deck by ID and set it as current
        const deck = await getDeckById(deckId);
        if (!deck) {
          // If deck not found, redirect to decks page
          navigate('/decks');
          return;
        }

        setCurrentDeck(deck);
        // Initialize words for this specific deck
        await initializeCards(deckId);
      } catch (error) {
        console.error('Failed to load deck and words:', error);
        // On error, redirect to decks page
        navigate('/decks');
      }
    };

    loadDeckAndWords();
  }, [deckId, navigate, getDeckById, setCurrentDeck, initializeCards, clearWords]);

  let content;
  if (isLoading) {
    content = <CircularProgress size={60} />;
  } else if (error) {
    content = (
      <Alert severity="error" onClose={clearError}>
        {error}
      </Alert>
    );
  } else if (words.length > 0) {
    content = <WordCardSlider words={words} />;
  } else {
    content = <Alert severity="info">No words available for this deck.</Alert>;
  }

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          py: 4,
        }}
      >
        {content}
      </Box>
    </Container>
  );
};

export default WordLearningPage;
