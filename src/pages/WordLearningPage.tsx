import {FC, useEffect} from 'react';
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import {useNavigate, useParams} from 'react-router-dom';
import WordCardSlider from '../components/word/WordCardSlider.tsx';
import {useCardsStore} from '../stores/useCardsStore.ts';
import {useDecksStore} from '../stores/useDecksStore';

export const WordLearningPage: FC = () => {
  const { deckId } = useParams<{ deckId: string }>();
  const navigate = useNavigate();
  const { words, isLoading, error, clearError, initializeCards, clearWords } = useCardsStore();
  const {setCurrentDeck, getDeckById, currentDeck} = useDecksStore();
  const theme = useTheme();

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
      {currentDeck && (
          <Card
              elevation={0}
              sx={{
                mb: 2,
                bgcolor: 'background.default',
                borderRadius: 2,
                p: {xs: 1, sm: 2},
                maxWidth: 500,
                mx: 'auto',
                opacity: 0.85,
              }}
          >
            <CardContent sx={{p: 0}}>
              <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 500,
                    fontSize: {xs: '1.1rem', sm: '1.2rem'},
                    mb: 0.5,
                    textAlign: 'center',
                    color: theme.palette.text.primary,
                  }}
              >
                {currentDeck.topic}
              </Typography>
              {currentDeck.description && (
                  <Typography
                      variant="body2"
                      sx={{
                        fontSize: {xs: '0.95rem', sm: '1rem'},
                        mb: 1,
                        textAlign: 'center',
                        color: theme.palette.text.primary,
                      }}
                  >
                    {currentDeck.description}
                  </Typography>
              )}
              <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
                <Chip
                    size="small"
                    label={currentDeck.languageFrom}
                    sx={{
                      bgcolor: theme.palette.primary.main,
                      color: theme.palette.text.primary,
                      fontSize: '0.85rem',
                    }}
                />
                <Chip
                    size="small"
                    label={currentDeck.languageTo}
                    sx={{
                      bgcolor: theme.palette.secondary.main,
                      color: theme.palette.background.paper,
                      fontSize: '0.85rem',
                    }}
                />
              </Stack>
            </CardContent>
          </Card>
      )}
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
