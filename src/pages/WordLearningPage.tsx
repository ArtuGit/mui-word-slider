import { FC, useEffect } from 'react';
import { Alert, Box, CircularProgress, Container } from '@mui/material';
import WordSlider from '../components/word-pair/WordSlider';
import { useWordsStore } from '../stores/useWordsStore';

export const WordLearningPage: FC = () => {
  const { words, isLoading, error, fetchWords, clearError } = useWordsStore();

  useEffect(() => {
    if (words.length === 0) {
      fetchWords();
    }
  }, [words.length, fetchWords]);

  let content;
  if (isLoading) {
    content = <CircularProgress size={60} />;
  } else if (error) {
    content = (
      <Alert
        severity="error"
        onClose={clearError}
        action={<button onClick={fetchWords}>Retry</button>}
      >
        {error}
      </Alert>
    );
  } else if (words.length > 0) {
    content = <WordSlider words={words} />;
  } else {
    content = <Alert severity="info">No words available</Alert>;
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
