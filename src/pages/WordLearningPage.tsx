import { FC } from 'react';
import { Alert, Box, CircularProgress, Container } from '@mui/material';
import WordSlider from '../components/word/WordSlider';
import { useWordsStore } from '../stores/useWordsStore';

export const WordLearningPage: FC = () => {
  const { words, isLoading, error, clearError } = useWordsStore();

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
    content = <WordSlider words={words} />;
  } else {
    content = <Alert severity="info">No words available. Please upload some word pairs.</Alert>;
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
