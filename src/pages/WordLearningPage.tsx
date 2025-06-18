import {FC, useEffect, useState} from 'react';
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
import type {IDeck} from '../types/deck.types';

export const WordLearningPage: FC = () => {
  const { deckId } = useParams<{ deckId: string }>();
  const navigate = useNavigate();
  const {words, isLoading, error, clearError, clearWords, loadCardsFromDB} = useCardsStore();
  const {getDeckById} = useDecksStore();
  const theme = useTheme();
  const [deck, setDeck] = useState<IDeck | null>(null);

  useEffect(() => {
    const loadDeckAndWords = async () => {
      if (!deckId) {
        navigate('/decks');
        return;
      }
      try {
        clearWords();
        const foundDeck = await getDeckById(deckId);
        if (!foundDeck) {
          navigate('/decks');
          return;
        }
        setDeck(foundDeck);
        await loadCardsFromDB(deckId);
      } catch (error) {
        console.error('Failed to load deck and words:', error);
        navigate('/decks');
      }
    };
    loadDeckAndWords();
  }, [deckId, navigate, getDeckById, loadCardsFromDB, clearWords]);

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
      {deck && (
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
                {deck.topic}
              </Typography>
              {deck.description && (
                  <Typography
                      variant="body2"
                      sx={{
                        fontSize: {xs: '0.95rem', sm: '1rem'},
                        mb: 1,
                        textAlign: 'center',
                        color: theme.palette.text.primary,
                      }}
                  >
                    {deck.description}
                  </Typography>
              )}
              <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
                <Chip
                    size="small"
                    label={deck.languageFrom}
                    sx={{
                      bgcolor: theme.palette.primary.main,
                      color: theme.palette.text.primary,
                      fontSize: '0.85rem',
                    }}
                />
                <Chip
                    size="small"
                    label={deck.languageTo}
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
